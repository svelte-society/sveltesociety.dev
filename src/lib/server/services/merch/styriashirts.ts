import { STYRIA_APP_ID, STYRIA_SECRET_KEY } from '$env/static/private'

export interface StyriashirtsOrderItem {
	product_code: string
	quantity: number
}

export interface StyriashirtsOrder {
	items: StyriashirtsOrderItem[]
	shipping: {
		name: string
		address_line1: string
		address_line2?: string
		city: string
		state?: string
		postal_code: string
		country: string
	}
	reference?: string
}

export interface StyriashirtsOrderResponse {
	id: string
	status: string
	created_at: string
}

export class StyriashirtsService {
	private appId: string
	private secretKey: string
	private baseUrl = 'https://styriashirts.eu/api'

	constructor(appId?: string, secretKey?: string) {
		this.appId = appId || STYRIA_APP_ID
		this.secretKey = secretKey || STYRIA_SECRET_KEY
	}

	async createOrder(order: StyriashirtsOrder): Promise<StyriashirtsOrderResponse> {
		const body = JSON.stringify({
			app_id: this.appId,
			items: order.items,
			shipping: order.shipping,
			reference: order.reference
		})

		return this.request('POST', '/orders.php', body)
	}

	async getOrder(orderId: string): Promise<StyriashirtsOrderResponse> {
		return this.request('GET', `/order.php?id=${orderId}`)
	}

	async listOrders(filters?: {
		status?: string
		limit?: number
		offset?: number
	}): Promise<StyriashirtsOrderResponse[]> {
		const params = new URLSearchParams()
		if (filters?.status) params.set('status', filters.status)
		if (filters?.limit) params.set('limit', String(filters.limit))
		if (filters?.offset) params.set('offset', String(filters.offset))

		const queryString = params.toString()
		return this.request('GET', `/orders.php${queryString ? '?' + queryString : ''}`)
	}

	private sign(body: string): string {
		const hasher = new Bun.CryptoHasher('sha1')
		hasher.update(body + this.secretKey)
		return hasher.digest('hex')
	}

	private async request(method: string, path: string, body?: string): Promise<any> {
		const url = `${this.baseUrl}${path}`
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			'X-App-Id': this.appId
		}

		if (body) {
			headers['X-Signature'] = this.sign(body)
		}

		const response = await fetch(url, {
			method,
			headers,
			body: method !== 'GET' ? body : undefined
		})

		if (!response.ok) {
			const errorText = await response.text()
			throw new Error(`Styria Shirts API error (${response.status}): ${errorText}`)
		}

		return response.json()
	}
}
