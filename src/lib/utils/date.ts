export function formatRelativeDate(date: Date | number | string): string {
	const now = new Date()
	const inputDate = new Date(date)
	const diffTime = now.getTime() - inputDate.getTime()
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

	if (diffDays === 0) {
		return 'Today'
	} else if (diffDays === 1) {
		return 'Yesterday'
	} else if (diffDays > 1 && diffDays <= 5) {
		return `${diffDays} days ago`
	} else {
		return inputDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}
}
