<script lang="ts">
	/**
	 * Presentational file upload component with preview and drag-drop.
	 * Does NOT handle submission - integrates with parent form.
	 *
	 * Usage with remote functions form:
	 * <FileUpload fieldProps={form.fields.file.as('file')} />
	 *
	 * Usage standalone with bind:files:
	 * <FileUpload bind:files={selectedFiles} name="image" />
	 */

	interface Props {
		/** Field props from remote functions form (form.fields.xxx.as('file')) */
		fieldProps?: Record<string, unknown>
		/** Name attribute for standalone usage */
		name?: string
		/** Bound files for standalone usage */
		files?: FileList | null
		label?: string
		description?: string
		accept?: string
		maxSize?: number
		required?: boolean
		'data-testid'?: string
	}

	let {
		fieldProps,
		name,
		files = $bindable(null),
		label,
		description,
		accept = 'image/jpeg,image/png,image/gif,image/webp',
		maxSize = 5 * 1024 * 1024,
		required = false,
		'data-testid': testId
	}: Props = $props()

	let previewUrl = $state<string | null>(null)
	let isDragging = $state(false)
	let errorMessage = $state<string | null>(null)
	let fileInputRef = $state<HTMLInputElement | null>(null)

	const computedTestId = $derived(testId || `file-upload-${name || 'file'}`)
	const inputName = $derived(fieldProps?.name as string || name || 'file')

	// Handle file selection for preview
	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement
		const file = input.files?.[0]

		if (!file) {
			previewUrl = null
			errorMessage = null
			files = null
			return
		}

		// Client-side validation
		const allowedTypes = accept.split(',').map((t) => t.trim())
		if (!allowedTypes.includes(file.type)) {
			errorMessage = `Invalid file type. Allowed: ${allowedTypes.map((t) => t.split('/')[1]?.toUpperCase() || t).join(', ')}`
			previewUrl = null
			files = null
			// Clear the input
			input.value = ''
			return
		}

		if (file.size > maxSize) {
			const maxMB = Math.round(maxSize / 1024 / 1024)
			errorMessage = `File too large. Maximum size: ${maxMB}MB`
			previewUrl = null
			files = null
			// Clear the input
			input.value = ''
			return
		}

		errorMessage = null
		files = input.files

		// Create preview URL
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl)
		}
		previewUrl = URL.createObjectURL(file)
	}

	// Handle drag events
	function handleDragOver(event: DragEvent) {
		event.preventDefault()
		isDragging = true
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault()
		isDragging = false
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault()
		isDragging = false

		const file = event.dataTransfer?.files?.[0]
		if (file && fileInputRef) {
			// Create a new DataTransfer to set the files
			const dt = new DataTransfer()
			dt.items.add(file)
			fileInputRef.files = dt.files

			// Trigger the change handler
			handleFileSelect({ target: fileInputRef } as unknown as Event)
		}
	}

	// Cleanup preview URL on unmount
	$effect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl)
			}
		}
	})
</script>

<div class="flex flex-col gap-2" data-testid={computedTestId}>
	{#if label}
		<label class="text-xs font-medium" for={inputName}>{label}</label>
	{/if}

	<!-- Drop zone -->
	<div
		class="relative flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors {isDragging
			? 'border-sky-400 bg-sky-50'
			: previewUrl
				? 'border-green-300 bg-green-50'
				: errorMessage
					? 'border-red-300 bg-red-50'
					: 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'}"
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		role="button"
		tabindex="0"
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				fileInputRef?.click()
			}
		}}
	>
		<!-- File input -->
		<input
			{...fieldProps}
			type="file"
			name={inputName}
			{accept}
			{required}
			id={inputName}
			class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
			onchange={handleFileSelect}
			bind:this={fileInputRef}
			data-testid="{computedTestId}-input"
		/>

		{#if previewUrl}
			<!-- Preview image -->
			<div class="p-4">
				<img
					src={previewUrl}
					alt="Preview"
					class="max-h-32 max-w-full rounded-lg object-contain"
				/>
				<p class="mt-2 text-center text-xs text-slate-600">Click or drag to replace</p>
			</div>
		{:else}
			<!-- Upload prompt -->
			<div class="flex flex-col items-center gap-2 p-6 text-center">
				<svg
					class="h-10 w-10 text-slate-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
					/>
				</svg>
				<p class="text-sm text-slate-600">
					<span class="font-medium text-sky-600">Click to upload</span> or drag and drop
				</p>
				<p class="text-xs text-slate-500">PNG, JPG, GIF or WebP (max 5MB)</p>
			</div>
		{/if}
	</div>

	<!-- Error state -->
	{#if errorMessage}
		<p class="text-sm text-red-600" data-testid="{computedTestId}-error">{errorMessage}</p>
	{/if}

	<!-- Description -->
	{#if description && !errorMessage}
		<p class="text-xs text-slate-500">{description}</p>
	{/if}
</div>
