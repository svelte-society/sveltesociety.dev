import { browser } from '$app/environment'

export interface CartItem {
	productId: string
	variantId: string
	productTitle: string
	variantLabel: string
	image: string
	priceCents: number
	stripePriceId: string
	quantity: number
}

const CART_KEY = 'svelte-society-cart'

function createCart() {
	let items = $state<CartItem[]>([])

	// Load from localStorage on init
	if (browser) {
		try {
			const stored = localStorage.getItem(CART_KEY)
			if (stored) {
				items = JSON.parse(stored)
			}
		} catch {
			// Ignore parse errors
		}
	}

	// Persist to localStorage on changes
	$effect(() => {
		if (browser) {
			localStorage.setItem(CART_KEY, JSON.stringify(items))
		}
	})

	const total = $derived(items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0))
	const itemCount = $derived(items.reduce((sum, item) => sum + item.quantity, 0))

	function addItem(item: Omit<CartItem, 'quantity'>, quantity: number = 1) {
		const existing = items.find(
			(i) => i.productId === item.productId && i.variantId === item.variantId
		)
		if (existing) {
			existing.quantity += quantity
		} else {
			items.push({ ...item, quantity })
		}
	}

	function removeItem(productId: string, variantId: string) {
		const index = items.findIndex((i) => i.productId === productId && i.variantId === variantId)
		if (index !== -1) {
			items.splice(index, 1)
		}
	}

	function updateQuantity(productId: string, variantId: string, quantity: number) {
		const item = items.find((i) => i.productId === productId && i.variantId === variantId)
		if (item) {
			if (quantity <= 0) {
				removeItem(productId, variantId)
			} else {
				item.quantity = quantity
			}
		}
	}

	function clearCart() {
		items.length = 0
	}

	return {
		get items() {
			return items
		},
		get total() {
			return total
		},
		get itemCount() {
			return itemCount
		},
		addItem,
		removeItem,
		updateQuantity,
		clearCart
	}
}

export const cart = createCart()
