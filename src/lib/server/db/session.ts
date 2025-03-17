import { Database } from 'bun:sqlite';

const SEVEN_DAYS = 7 * 24 * 60 * 60; // 7 days in seconds

export interface Session {
	id: number;
	user_id: string;
	session_token: string;
	expires_at: string;
	created_at: string;
}

export interface SessionResult {
	valid: boolean;
	user_id?: string;
}

export class SessionService {
	private deleteSessionStatement;
	private createSessionStatement;
	private validateSessionStatement;
	private deleteSessionsByUserIdStatement;
	private checkUserExistsStatement;

	constructor(private db: Database) {
		this.deleteSessionStatement = this.db.prepare(`
			DELETE FROM sessions
			WHERE session_token = $session_token
			RETURNING *
		`);

		this.createSessionStatement = this.db.prepare(`
			INSERT INTO sessions (user_id, session_token, expires_at)
			VALUES ($user_id, $session_token, $expires_at)
			RETURNING session_token
		`);

		this.validateSessionStatement = this.db.prepare(`
			SELECT user_id
			FROM sessions
			WHERE session_token = $session_token
			AND expires_at > datetime('now')
			LIMIT 1
		`);

		this.deleteSessionsByUserIdStatement = this.db.prepare(`
			DELETE FROM sessions
			WHERE user_id = $user_id
			RETURNING *
		`);

		this.checkUserExistsStatement = this.db.prepare(`
			SELECT 1 FROM users WHERE id = $user_id LIMIT 1
		`);
	}

	private generateUUID(): string {
		return crypto.randomUUID();
	}

	private formatDateForSQLite(date: Date): string {
		return date.toISOString().replace('T', ' ').replace('Z', '');
	}

	private userExists(userId: string): boolean {
		const result = this.checkUserExistsStatement.get({ $user_id: userId });
		return result !== null;
	}

	deleteSession(sessionToken: string): Session | undefined {
		try {
			const result = this.deleteSessionStatement.get({ $session_token: sessionToken });
			return result ? result as Session : undefined;
		} catch (error) {
			console.error('Error deleting session:', error);
			return undefined;
		}
	}

	deleteSessionsByUserId(userId: string): number {
		try {
			const result = this.deleteSessionsByUserIdStatement.all({ $user_id: userId }) as Session[];
			return result.length;
		} catch (error) {
			console.error('Error deleting sessions by user ID:', error);
			return 0;
		}
	}

	createSession(userId: string): string {
		if (!this.userExists(userId)) {
			throw new Error(`User with ID ${userId} does not exist`);
		}

		try {
			const sessionToken = this.generateUUID();
			const now = new Date();
			const expiration = new Date(now.getTime() + SEVEN_DAYS * 1000);

			const result = this.createSessionStatement.get({
				$user_id: userId,
				$session_token: sessionToken,
				$expires_at: this.formatDateForSQLite(expiration)
			}) as { session_token: string };

			return result.session_token;
		} catch (error) {
			console.error('Error creating session:', error);
			throw error;
		}
	}

	validateSessionId(sessionToken: string): SessionResult {
		try {
			const result = this.validateSessionStatement.get({ $session_token: sessionToken });
			
			if (!result) {
				return { valid: false };
			}

			const { user_id } = result as { user_id: string | null };
			if (user_id === null) {
				return { valid: false };
			}

			return { valid: true, user_id };
		} catch (error) {
			console.error('Error validating session:', error);
			return { valid: false };
		}
	}
}
