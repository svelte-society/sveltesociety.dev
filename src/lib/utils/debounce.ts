export function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
	let timeout: ReturnType<typeof setTimeout> | null = null

	return (...args: Parameters<F>): Promise<ReturnType<F>> => {
		return new Promise((resolve) => {
			if (timeout) {
				clearTimeout(timeout)
			}

			timeout = setTimeout(() => {
				resolve(func(...args))
			}, waitFor)
		})
	}
}
