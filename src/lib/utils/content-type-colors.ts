/**
 * Get Tailwind CSS classes for content type badges
 */
export function getContentTypeColor(type: string): string {
	switch (type) {
		case 'video':
			return 'bg-red-100 text-red-800'
		case 'library':
			return 'bg-purple-100 text-purple-800'
		case 'recipe':
			return 'bg-green-100 text-green-800'
		case 'resource':
			return 'bg-blue-100 text-blue-800'
		default:
			return 'bg-gray-100 text-gray-800'
	}
}
