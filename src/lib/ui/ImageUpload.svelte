<script lang="ts">
	import type { RemoteFormIssue } from '@sveltejs/kit'
	import type { HTMLInputAttributes } from 'svelte/elements'
	import Upload from 'phosphor-svelte/lib/Upload'
	import X from 'phosphor-svelte/lib/X'
	import Image from 'phosphor-svelte/lib/Image'

	type Props = {
		label?: string
		description?: string
		accept?: string
		maxSizeMB?: number
		issues?: RemoteFormIssue[]
		'data-testid'?: string
	} & HTMLInputAttributes

	let {
		label,
		description,
		accept = 'image/png,image/jpeg,image/webp,image/gif',
		maxSizeMB = 2,
		issues,
		'data-testid': testId,
		...inputProps
	}: Props = $props()

	let fileInput: HTMLInputElement | undefined = $state()
	let previewUrl = $state('')
	let error = $state('')
	let isDragOver = $state(false)

	const hasErrors = $derived((issues && issues.length > 0) || error !== '')

	function handleFileSelect(file: File | null) {
		if (!file) {
			previewUrl = ''
			error = ''
			return
		}

		// Validate file type
		const validTypes = accept.split(',').map((t) => t.trim())
		if (!validTypes.includes(file.type)) {
			error = `Invalid file type. Accepted: ${validTypes.join(', ')}`
			return
		}

		// Validate file size
		const maxBytes = maxSizeMB * 1024 * 1024
		if (file.size > maxBytes) {
			error = `File too large. Maximum size: ${maxSizeMB}MB`
			return
		}

		error = ''

		// Create preview URL
		previewUrl = URL.createObjectURL(file)
	}

	function handleInputChange(e: Event) {
		const input = e.target as HTMLInputElement
		const file = input.files?.[0] || null
		handleFileSelect(file)
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault()
		isDragOver = false

		const file = e.dataTransfer?.files?.[0] || null
		if (file && fileInput) {
			// Create a DataTransfer to set the file on the input
			const dt = new DataTransfer()
			dt.items.add(file)
			fileInput.files = dt.files
			handleFileSelect(file)
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault()
		isDragOver = true
	}

	function handleDragLeave() {
		isDragOver = false
	}

	function clearImage() {
		previewUrl = ''
		error = ''
		if (fileInput) {
			fileInput.value = ''
		}
	}

	function openFilePicker() {
		fileInput?.click()
	}
</script>

<div class="flex flex-col gap-2">
	{#if label}
		<span class="text-xs font-medium">{label}</span>
	{/if}

	<input
		bind:this={fileInput}
		type="file"
		{accept}
		onchange={handleInputChange}
		class="hidden"
		data-testid={testId ? `${testId}-file` : undefined}
		{...inputProps}
	/>

	{#if previewUrl}
		<div class="relative inline-block">
			<img
				src={previewUrl}
				alt="Preview"
				class="h-24 w-24 rounded-lg border-2 border-slate-200 object-contain bg-white"
			/>
			<button
				type="button"
				onclick={clearImage}
				class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
				data-testid={testId ? `${testId}-clear` : undefined}
			>
				<X size={14} weight="bold" />
			</button>
		</div>
	{:else}
		<button
			type="button"
			onclick={openFilePicker}
			ondrop={handleDrop}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			class="flex h-24 w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors {isDragOver
				? 'border-orange-400 bg-orange-50'
				: hasErrors
					? 'border-red-300 bg-red-50'
					: 'border-slate-300 bg-slate-50 hover:border-orange-300 hover:bg-orange-50'}"
			data-testid={testId}
		>
			{#if isDragOver}
				<Upload size={24} class="text-orange-500" />
				<span class="text-xs text-orange-600">Drop image here</span>
			{:else}
				<Image size={24} class="text-slate-400" />
				<span class="text-xs text-slate-500">Click or drag to upload</span>
			{/if}
		</button>
	{/if}

	{#if hasErrors}
		{#if error}
			<div class="text-xs text-red-600">{error}</div>
		{/if}
		{#if issues}
			{#each issues as issue, i (i)}
				<div class="text-xs text-red-600">{issue.message}</div>
			{/each}
		{/if}
	{:else if description}
		<div class="text-xs text-slate-500">{description}</div>
	{/if}
</div>
