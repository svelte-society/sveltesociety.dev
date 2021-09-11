export const copyToClipboard = (text: string): Promise<boolean> =>
	new Promise<boolean>((resolve) =>
		navigator.clipboard
			.writeText(text)
			.then(() => setTimeout(() => resolve(true), 1000))
			.catch(() => alert('Clipboard copy Permission denied'))
	);
