import type { Database } from 'better-sqlite3'
import type { SocialCredentials, SocialCredentialsRaw, SocialPlatform } from '$lib/types/social'
import { env } from '$env/dynamic/private'

// Re-export types for consumers
export type { SocialCredentials }

// Credential structure stored in encrypted blob
export interface TwitterCredentials {
	access_token: string
	refresh_token?: string
	token_type: string
	scope?: string
}

export interface BlueskyCredentials {
	identifier: string // handle or DID
	password: string // app password
	did?: string
	handle?: string
}

export interface LinkedInCredentials {
	access_token: string
	refresh_token?: string
	expires_in?: number
}

export type PlatformCredentials = TwitterCredentials | BlueskyCredentials | LinkedInCredentials

export class SocialCredentialService {
	private db: Database
	private encryptionKey: Buffer | null = null

	private createStatement: ReturnType<Database['prepare']>
	private getByIdStatement: ReturnType<Database['prepare']>
	private getByPlatformStatement: ReturnType<Database['prepare']>
	private getActiveByPlatformStatement: ReturnType<Database['prepare']>
	private updateStatement: ReturnType<Database['prepare']>
	private deleteStatement: ReturnType<Database['prepare']>
	private listStatement: ReturnType<Database['prepare']>
	private updateLastUsedStatement: ReturnType<Database['prepare']>
	private updateErrorStatement: ReturnType<Database['prepare']>

	constructor(db: Database) {
		this.db = db

		// Initialize encryption key from environment
		const credentialsKey = env.SOCIAL_CREDENTIALS_KEY
		if (credentialsKey) {
			// Key should be 32 bytes (256 bits) hex-encoded
			this.encryptionKey = Buffer.from(credentialsKey, 'hex')
			if (this.encryptionKey.length !== 32) {
				console.error('SOCIAL_CREDENTIALS_KEY must be 32 bytes (64 hex characters)')
				this.encryptionKey = null
			}
		}

		this.createStatement = this.db.prepare(`
			INSERT INTO social_credentials (
				platform, account_name, account_id,
				credentials_encrypted, iv,
				expires_at, refresh_token_encrypted, refresh_iv,
				is_active
			)
			VALUES (
				$platform, $account_name, $account_id,
				$credentials_encrypted, $iv,
				$expires_at, $refresh_token_encrypted, $refresh_iv,
				$is_active
			)
			RETURNING *
		`)

		this.getByIdStatement = this.db.prepare(`
			SELECT * FROM social_credentials WHERE id = $id
		`)

		this.getByPlatformStatement = this.db.prepare(`
			SELECT * FROM social_credentials WHERE platform = $platform
		`)

		this.getActiveByPlatformStatement = this.db.prepare(`
			SELECT * FROM social_credentials
			WHERE platform = $platform AND is_active = 1
			LIMIT 1
		`)

		this.updateStatement = this.db.prepare(`
			UPDATE social_credentials
			SET account_name = $account_name,
				account_id = $account_id,
				credentials_encrypted = $credentials_encrypted,
				iv = $iv,
				expires_at = $expires_at,
				refresh_token_encrypted = $refresh_token_encrypted,
				refresh_iv = $refresh_iv,
				is_active = $is_active
			WHERE id = $id
			RETURNING *
		`)

		this.deleteStatement = this.db.prepare(`
			DELETE FROM social_credentials WHERE id = $id
		`)

		this.listStatement = this.db.prepare(`
			SELECT * FROM social_credentials
			ORDER BY platform, account_name
		`)

		this.updateLastUsedStatement = this.db.prepare(`
			UPDATE social_credentials
			SET last_used_at = CURRENT_TIMESTAMP, last_error = NULL
			WHERE id = $id
		`)

		this.updateErrorStatement = this.db.prepare(`
			UPDATE social_credentials
			SET last_error = $error
			WHERE id = $id
		`)
	}

	// ==========================================
	// Encryption/Decryption Helpers
	// ==========================================

	/**
	 * Check if encryption is available
	 */
	isEncryptionAvailable(): boolean {
		return this.encryptionKey !== null
	}

	/**
	 * Encrypt credentials using AES-256-GCM
	 */
	private async encrypt(data: string): Promise<{ encrypted: string; iv: string } | null> {
		if (!this.encryptionKey) {
			console.error('Encryption key not available')
			return null
		}

		try {
			// Generate random IV (12 bytes for GCM)
			const iv = crypto.getRandomValues(new Uint8Array(12))

			// Import key for Web Crypto API
			const key = await crypto.subtle.importKey(
				'raw',
				this.encryptionKey,
				{ name: 'AES-GCM' },
				false,
				['encrypt']
			)

			// Encrypt
			const encoded = new TextEncoder().encode(data)
			const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)

			return {
				encrypted: Buffer.from(encrypted).toString('base64'),
				iv: Buffer.from(iv).toString('base64')
			}
		} catch (error) {
			console.error('Error encrypting credentials:', error)
			return null
		}
	}

	/**
	 * Decrypt credentials using AES-256-GCM
	 */
	private async decrypt(encrypted: string, iv: string): Promise<string | null> {
		if (!this.encryptionKey) {
			console.error('Encryption key not available')
			return null
		}

		try {
			// Import key for Web Crypto API
			const key = await crypto.subtle.importKey(
				'raw',
				this.encryptionKey,
				{ name: 'AES-GCM' },
				false,
				['decrypt']
			)

			// Decrypt
			const decrypted = await crypto.subtle.decrypt(
				{ name: 'AES-GCM', iv: Buffer.from(iv, 'base64') },
				key,
				Buffer.from(encrypted, 'base64')
			)

			return new TextDecoder().decode(decrypted)
		} catch (error) {
			console.error('Error decrypting credentials:', error)
			return null
		}
	}

	// ==========================================
	// Parsing Helpers
	// ==========================================

	private parseRaw(row: SocialCredentialsRaw | null): SocialCredentials | null {
		if (!row) return null

		// Never expose encrypted data
		return {
			id: row.id,
			platform: row.platform,
			account_name: row.account_name,
			account_id: row.account_id,
			expires_at: row.expires_at,
			is_active: row.is_active === 1,
			last_used_at: row.last_used_at,
			last_error: row.last_error,
			created_at: row.created_at,
			updated_at: row.updated_at
		}
	}

	// ==========================================
	// CRUD Methods
	// ==========================================

	/**
	 * Create new credentials
	 */
	async create(
		platform: SocialPlatform,
		accountName: string,
		credentials: PlatformCredentials,
		options?: {
			accountId?: string
			expiresAt?: string
			refreshToken?: string
		}
	): Promise<SocialCredentials | null> {
		try {
			// Encrypt main credentials
			const encryptedCreds = await this.encrypt(JSON.stringify(credentials))
			if (!encryptedCreds) {
				console.error('Failed to encrypt credentials')
				return null
			}

			// Encrypt refresh token if provided
			let refreshEncrypted: { encrypted: string; iv: string } | null = null
			if (options?.refreshToken) {
				refreshEncrypted = await this.encrypt(options.refreshToken)
			}

			const result = this.createStatement.get({
				platform,
				account_name: accountName,
				account_id: options?.accountId ?? null,
				credentials_encrypted: encryptedCreds.encrypted,
				iv: encryptedCreds.iv,
				expires_at: options?.expiresAt ?? null,
				refresh_token_encrypted: refreshEncrypted?.encrypted ?? null,
				refresh_iv: refreshEncrypted?.iv ?? null,
				is_active: 1
			}) as SocialCredentialsRaw | undefined

			return result ? this.parseRaw(result) : null
		} catch (error) {
			console.error('Error creating social credentials:', error)
			return null
		}
	}

	/**
	 * Get credentials metadata by ID (without decrypted credentials)
	 */
	getById(id: string): SocialCredentials | null {
		try {
			const result = this.getByIdStatement.get({ id }) as SocialCredentialsRaw | undefined
			return result ? this.parseRaw(result) : null
		} catch (error) {
			console.error('Error getting social credentials by id:', error)
			return null
		}
	}

	/**
	 * Get and decrypt credentials by ID
	 */
	async getDecryptedCredentials(id: string): Promise<PlatformCredentials | null> {
		try {
			const row = this.getByIdStatement.get({ id }) as SocialCredentialsRaw | undefined
			if (!row) return null

			const decrypted = await this.decrypt(row.credentials_encrypted, row.iv)
			if (!decrypted) return null

			return JSON.parse(decrypted) as PlatformCredentials
		} catch (error) {
			console.error('Error getting decrypted credentials:', error)
			return null
		}
	}

	/**
	 * Get active credentials for a platform
	 */
	getActiveByPlatform(platform: SocialPlatform): SocialCredentials | null {
		try {
			const result = this.getActiveByPlatformStatement.get({ platform }) as
				| SocialCredentialsRaw
				| undefined
			return result ? this.parseRaw(result) : null
		} catch (error) {
			console.error('Error getting active credentials by platform:', error)
			return null
		}
	}

	/**
	 * Get and decrypt active credentials for a platform
	 */
	async getActiveDecryptedCredentials(
		platform: SocialPlatform
	): Promise<PlatformCredentials | null> {
		try {
			const row = this.getActiveByPlatformStatement.get({ platform }) as
				| SocialCredentialsRaw
				| undefined
			if (!row) return null

			const decrypted = await this.decrypt(row.credentials_encrypted, row.iv)
			if (!decrypted) return null

			// Update last used timestamp
			this.updateLastUsedStatement.run({ id: row.id })

			return JSON.parse(decrypted) as PlatformCredentials
		} catch (error) {
			console.error('Error getting active decrypted credentials:', error)
			return null
		}
	}

	/**
	 * Update credentials
	 */
	async update(
		id: string,
		credentials: PlatformCredentials,
		options?: {
			accountName?: string
			accountId?: string
			expiresAt?: string
			refreshToken?: string
			isActive?: boolean
		}
	): Promise<SocialCredentials | null> {
		try {
			const existing = this.getByIdStatement.get({ id }) as SocialCredentialsRaw | undefined
			if (!existing) return null

			// Encrypt new credentials
			const encryptedCreds = await this.encrypt(JSON.stringify(credentials))
			if (!encryptedCreds) {
				console.error('Failed to encrypt credentials')
				return null
			}

			// Encrypt refresh token if provided
			let refreshEncrypted: string | null = existing.refresh_token_encrypted
			let refreshIv: string | null = existing.refresh_iv
			if (options?.refreshToken !== undefined) {
				if (options.refreshToken) {
					const encrypted = await this.encrypt(options.refreshToken)
					if (encrypted) {
						refreshEncrypted = encrypted.encrypted
						refreshIv = encrypted.iv
					}
				} else {
					refreshEncrypted = null
					refreshIv = null
				}
			}

			const result = this.updateStatement.get({
				id,
				account_name: options?.accountName ?? existing.account_name,
				account_id: options?.accountId !== undefined ? options.accountId : existing.account_id,
				credentials_encrypted: encryptedCreds.encrypted,
				iv: encryptedCreds.iv,
				expires_at: options?.expiresAt !== undefined ? options.expiresAt : existing.expires_at,
				refresh_token_encrypted: refreshEncrypted,
				refresh_iv: refreshIv,
				is_active: options?.isActive !== undefined ? (options.isActive ? 1 : 0) : existing.is_active
			}) as SocialCredentialsRaw | undefined

			return result ? this.parseRaw(result) : null
		} catch (error) {
			console.error('Error updating social credentials:', error)
			return null
		}
	}

	/**
	 * Delete credentials
	 */
	delete(id: string): boolean {
		try {
			const result = this.deleteStatement.run({ id })
			return result.changes > 0
		} catch (error) {
			console.error('Error deleting social credentials:', error)
			return false
		}
	}

	/**
	 * List all credentials (metadata only, no decrypted data)
	 */
	list(): SocialCredentials[] {
		try {
			const rows = this.listStatement.all() as SocialCredentialsRaw[]
			return rows.map((row) => this.parseRaw(row)).filter((c): c is SocialCredentials => c !== null)
		} catch (error) {
			console.error('Error listing social credentials:', error)
			return []
		}
	}

	/**
	 * Get all credentials for a platform
	 */
	getByPlatform(platform: SocialPlatform): SocialCredentials[] {
		try {
			const rows = this.getByPlatformStatement.all({ platform }) as SocialCredentialsRaw[]
			return rows.map((row) => this.parseRaw(row)).filter((c): c is SocialCredentials => c !== null)
		} catch (error) {
			console.error('Error getting credentials by platform:', error)
			return []
		}
	}

	// ==========================================
	// Status Methods
	// ==========================================

	/**
	 * Mark credentials as used (updates last_used_at)
	 */
	markUsed(id: string): void {
		try {
			this.updateLastUsedStatement.run({ id })
		} catch (error) {
			console.error('Error marking credentials as used:', error)
		}
	}

	/**
	 * Record an error for credentials
	 */
	recordError(id: string, error: string): void {
		try {
			this.updateErrorStatement.run({ id, error })
		} catch (error) {
			console.error('Error recording credentials error:', error)
		}
	}

	/**
	 * Activate credentials (and optionally deactivate others for same platform)
	 */
	activate(id: string, deactivateOthers: boolean = true): boolean {
		try {
			const credential = this.getById(id)
			if (!credential) return false

			if (deactivateOthers) {
				// Deactivate all other credentials for this platform
				const deactivateStatement = this.db.prepare(`
					UPDATE social_credentials
					SET is_active = 0
					WHERE platform = $platform AND id != $id
				`)
				deactivateStatement.run({
					platform: credential.platform,
					id
				})
			}

			// Activate this credential
			const activateStatement = this.db.prepare(`
				UPDATE social_credentials
				SET is_active = 1
				WHERE id = $id
			`)
			activateStatement.run({ id })

			return true
		} catch (error) {
			console.error('Error activating credentials:', error)
			return false
		}
	}

	/**
	 * Deactivate credentials
	 */
	deactivate(id: string): boolean {
		try {
			const deactivateStatement = this.db.prepare(`
				UPDATE social_credentials
				SET is_active = 0
				WHERE id = $id
			`)
			const result = deactivateStatement.run({ id })
			return result.changes > 0
		} catch (error) {
			console.error('Error deactivating credentials:', error)
			return false
		}
	}

	// ==========================================
	// Token Refresh Methods
	// ==========================================

	/**
	 * Get decrypted refresh token
	 */
	async getRefreshToken(id: string): Promise<string | null> {
		try {
			const row = this.getByIdStatement.get({ id }) as SocialCredentialsRaw | undefined
			if (!row || !row.refresh_token_encrypted || !row.refresh_iv) return null

			return await this.decrypt(row.refresh_token_encrypted, row.refresh_iv)
		} catch (error) {
			console.error('Error getting refresh token:', error)
			return null
		}
	}

	/**
	 * Check if credentials are expiring soon (within hours)
	 */
	isExpiringSoon(credential: SocialCredentials, hoursThreshold: number = 24): boolean {
		if (!credential.expires_at) return false

		const expiresAt = new Date(credential.expires_at)
		const now = new Date()
		const hoursUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)

		return hoursUntilExpiry <= hoursThreshold
	}

	/**
	 * Get credentials that are expiring soon
	 */
	getExpiringSoon(hoursThreshold: number = 24): SocialCredentials[] {
		try {
			const thresholdDate = new Date(Date.now() + hoursThreshold * 60 * 60 * 1000)

			const statement = this.db.prepare(`
				SELECT * FROM social_credentials
				WHERE is_active = 1
				AND expires_at IS NOT NULL
				AND expires_at <= $threshold
				ORDER BY expires_at ASC
			`)

			const rows = statement.all({
				threshold: thresholdDate.toISOString()
			}) as SocialCredentialsRaw[]

			return rows.map((row) => this.parseRaw(row)).filter((c): c is SocialCredentials => c !== null)
		} catch (error) {
			console.error('Error getting expiring credentials:', error)
			return []
		}
	}
}
