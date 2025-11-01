export function formatRelativeDate(date: string | null): string {
	if (!date) {
		return 'Unknown date'
	}

	const inputDate = new Date(date)
	return inputDate.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
}
