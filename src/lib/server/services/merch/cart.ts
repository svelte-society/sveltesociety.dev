import { Database } from 'bun:sqlite'

export interface MerchCartItem {
	id: string
	user_id: string
	product_id: string
	variant_id: string
	product_title: string
	variant_label: string
	image: string
	price_cents: number
	quantity: number
	created_at: string
	updated_at: string
}

export interface CartSummary {
	itemCount: number
	totalCents: number
}

export class MerchCartService {
	constructor(private db: Database) {}

	getCartItems(userId: string): MerchCartItem[] {
		return this.db
			.prepare('SELECT * FROM merch_cart_items WHERE user_id = $userId ORDER BY created_at ASC')
			.all({ userId }) as MerchCartItem[]
	}

	addItem(
		userId: string,
		data: {
			productId: string
			variantId: string
			productTitle: string
			variantLabel: string
			image: string
			priceCents: number
			quantity: number
		}
	): MerchCartItem {
		const row = this.db
			.prepare(
				`INSERT INTO merch_cart_items (user_id, product_id, variant_id, product_title, variant_label, image, price_cents, quantity)
			VALUES ($userId, $productId, $variantId, $productTitle, $variantLabel, $image, $priceCents, $quantity)
			ON CONFLICT(user_id, variant_id) DO UPDATE SET
				quantity = merch_cart_items.quantity + excluded.quantity,
				updated_at = CURRENT_TIMESTAMP
			RETURNING *`
			)
			.get({
				userId,
				productId: data.productId,
				variantId: data.variantId,
				productTitle: data.productTitle,
				variantLabel: data.variantLabel,
				image: data.image,
				priceCents: data.priceCents,
				quantity: data.quantity
			}) as MerchCartItem

		return row
	}

	updateQuantity(userId: string, variantId: string, quantity: number): boolean {
		if (quantity <= 0) {
			return this.removeItem(userId, variantId)
		}

		const result = this.db
			.prepare(
				'UPDATE merch_cart_items SET quantity = $quantity, updated_at = CURRENT_TIMESTAMP WHERE user_id = $userId AND variant_id = $variantId'
			)
			.run({ userId, variantId, quantity })

		return result.changes > 0
	}

	removeItem(userId: string, variantId: string): boolean {
		const result = this.db
			.prepare('DELETE FROM merch_cart_items WHERE user_id = $userId AND variant_id = $variantId')
			.run({ userId, variantId })

		return result.changes > 0
	}

	clearCart(userId: string): void {
		this.db.prepare('DELETE FROM merch_cart_items WHERE user_id = $userId').run({ userId })
	}

	getCartSummary(userId: string): CartSummary {
		const result = this.db
			.prepare(
				'SELECT COALESCE(SUM(quantity), 0) as itemCount, COALESCE(SUM(price_cents * quantity), 0) as totalCents FROM merch_cart_items WHERE user_id = $userId'
			)
			.get({ userId }) as CartSummary

		return result
	}
}
