<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms'
	import { Control, Description, Field, FieldErrors, Label } from 'formsnap'
	import { getContext } from 'svelte'
	import { Combobox } from 'bits-ui'

	interface Option {
		value: string
		label: string
		avatar?: string
	}

	interface AutoCompleteProps {
		label?: string
		description?: string
		placeholder?: string
		name: string
		disabled?: boolean
		options: Option[]
		testId?: string
	}

	let {
		name,
		label,
		description,
		placeholder = 'Search...',
		options,
		disabled = false,
		testId
	}: AutoCompleteProps = $props()

	const computedTestId = $derived(testId || `autocomplete-${name}`)

	const form: SuperForm<Record<string, string>, any> = getContext('form')
	const { form: formData } = form

	let searchValue = $state('')
	let open = $state(false)

	const filteredOptions = $derived(
		searchValue === ''
			? options
			: options.filter((option) =>
					option.label.toLowerCase().includes(searchValue.toLowerCase())
				)
	)

	function handleOpenChange(isOpen: boolean) {
		open = isOpen
		if (!isOpen) {
			searchValue = ''
		}
	}
</script>

<Field {form} {name}>
	<div class="flex flex-col gap-2">
		<Control>
			{#snippet children({ props })}
				<Label class="text-xs font-medium outline-none">
					{label}
				</Label>
				<Combobox.Root
					type="single"
					bind:value={$formData[name]}
					bind:open
					onOpenChange={handleOpenChange}
					{disabled}
				>
					<div class="relative">
						<Combobox.Input
							{...props}
							data-testid={computedTestId}
							oninput={(e) => (searchValue = e.currentTarget.value)}
							onfocus={() => (open = true)}
							{placeholder}
							class="w-full rounded-md border-2 border-transparent bg-slate-100 px-3 py-1.5 pr-8 text-sm text-slate-800 placeholder-slate-500 focus:outline-2 focus:outline-sky-200 disabled:cursor-not-allowed disabled:opacity-50 data-fs-error:border-red-300 data-fs-error:bg-red-50 data-fs-error:text-red-600"
						/>
						<Combobox.Trigger
							class="absolute end-2 top-1/2 -translate-y-1/2 text-slate-500"
							{disabled}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</Combobox.Trigger>
					</div>

					<Combobox.Portal>
						<Combobox.Content
							class="z-50 mt-1 max-h-60 w-[var(--bits-combobox-anchor-width)] overflow-auto rounded-md border bg-white shadow-lg"
						>
							<Combobox.Viewport class="p-1">
								{#if filteredOptions.length > 0}
									{#each filteredOptions as option (option.value)}
										<Combobox.Item
											value={option.value}
											label={option.label}
											class="flex w-full cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm data-highlighted:bg-slate-100"
										>
											{#snippet children({ selected })}
												{#if option.avatar}
													<img
														src={option.avatar}
														alt=""
														class="h-6 w-6 rounded-full object-cover"
													/>
												{:else}
													<div
														class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-xs font-medium text-slate-700"
													>
														{option.label.charAt(0).toUpperCase()}
													</div>
												{/if}
												<span class="flex-1">{option.label}</span>
												{#if selected}
													<svg
														xmlns="http://www.w3.org/2000/svg"
														class="h-4 w-4 text-sky-600"
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path
															fill-rule="evenodd"
															d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L7 12.586l7.293-7.293a1 1 0 011.414 0z"
															clip-rule="evenodd"
														/>
													</svg>
												{/if}
											{/snippet}
										</Combobox.Item>
									{/each}
								{:else}
									<span class="block px-3 py-2 text-sm text-slate-500">No results found</span>
								{/if}
							</Combobox.Viewport>
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			{/snippet}
		</Control>
		<Description class="text-xs text-slate-500 data-fs-error:sr-only">{description}</Description>
		<FieldErrors class="text-xs text-red-600" />
	</div>
</Field>
