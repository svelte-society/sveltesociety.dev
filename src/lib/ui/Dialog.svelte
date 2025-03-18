<script lang="ts">
	import { Dialog, Label, Separator } from "bits-ui";
	import X from "phosphor-svelte/lib/X";
	import type { Snippet } from "svelte";

	type DialogProps = Dialog.RootProps & {
		/**
		 * The text displayed on the trigger button
		 */
		triggerText: string;
		
		/**
		 * The title of the dialog
		 */
		title: string | Snippet;
		
		/**
		 * The description of the dialog
		 */
		description?: string | Snippet;
		
		/**
		 * Custom content to render in the dialog body
		 */
		content?: Snippet;
		
		/**
		 * Text for the confirmation/save button
		 */
		confirmText?: string;
		
		/**
		 * Additional props to pass to the content component
		 */
		contentProps?: Omit<Dialog.ContentProps, "children" | "child">;
		
		/**
		 * Additional props to pass to the trigger button
		 */
		triggerProps?: Omit<Dialog.TriggerProps, "children" | "child">;
		
		/**
		 * Additional props to pass to the overlay
		 */
		overlayProps?: Omit<Dialog.OverlayProps, "children" | "child">;
		
		/**
		 * Additional props to pass to the close button
		 */
		closeProps?: Omit<Dialog.CloseProps, "children" | "child">;
		
		/**
		 * Additional class names for the trigger button
		 */
		triggerClass?: string;
		
		/**
		 * Additional class names for the content container
		 */
		contentClass?: string;
		
		/**
		 * Additional class names for the overlay
		 */
		overlayClass?: string;
		
		/**
		 * Additional class names for the confirm button
		 */
		confirmClass?: string;
		
		/**
		 * Additional class names for the close button
		 */
		closeClass?: string;
		
		/**
		 * Whether to show the confirm button
		 */
		showConfirm?: boolean;
	};

	let {
		open = $bindable(false),
		triggerText = "Open",
		title,
		description,
		content,
		confirmText = "Save",
		contentProps = {},
		triggerProps = {},
		overlayProps = {},
		closeProps = {},
		triggerClass = "",
		contentClass = "",
		overlayClass = "",
		confirmClass = "",
		closeClass = "",
		showConfirm = true,
		...rootProps
	}: DialogProps = $props();
</script>

<!--
@component
A reusable dialog component built with bits-ui.

Features:
- Customizable trigger and content
- Accessible by default
- Properly handles focus management
- Animation ready with data-state attributes

Usage:
```svelte
<Dialog 
  triggerText="Open Settings" 
  title="Settings"
  description="Configure your application settings."
  showConfirm={true}
  confirmText="Apply"
>
  {#snippet content()}
    <div class="p-4">Custom form or content here</div>
  {/snippet}
</Dialog>
```

For simple usage with string content:
```svelte
<Dialog 
  triggerText="Open Dialog" 
  title="Hello"
  description="This is a simple dialog"
/>
```
-->

<Dialog.Root bind:open {...rootProps}>
	<Dialog.Trigger
		class="rounded-md bg-orange-400 text-white
      shadow-sm hover:bg-orange-500 focus-visible:ring-orange-400 focus-visible:ring-offset-white focus-visible:outline-none
      inline-flex h-12 items-center justify-center whitespace-nowrap px-5 text-base font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] {triggerClass}"
		{...triggerProps}
	>
		{triggerText}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/40 {overlayClass}"
			{...overlayProps}
		/>
		<Dialog.Content
			class="rounded-lg bg-white shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-none fixed left-[50%] top-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] border border-orange-100 p-5 sm:max-w-[490px] md:w-full {contentClass}"
			{...contentProps}
		>
			<Dialog.Title
				class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
			>
				{#if typeof title === 'string'}
					{title}
				{:else}
					{@render title()}
				{/if}
			</Dialog.Title>
			<Separator.Root class="bg-orange-200 -mx-5 mb-6 mt-5 block h-px" />
			
			{#if description}
				<Dialog.Description class="text-gray-500 text-sm">
					{#if typeof description === 'string'}
						{description}
					{:else}
						{@render description()}
					{/if}
				</Dialog.Description>
			{/if}
			
			{#if content}
				<div class="py-5">
					{@render content()}
				</div>
			{/if}
			
			{#if showConfirm}
				<div class="flex w-full justify-end">
					<Dialog.Close
						class="h-10 rounded-md bg-orange-500 text-white shadow-sm hover:bg-orange-600 focus-visible:ring-orange-400 focus-visible:ring-offset-white focus-visible:outline-none inline-flex items-center justify-center px-6 text-base font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] {confirmClass}"
					>
						{confirmText}
					</Dialog.Close>
				</div>
			{/if}
			
			<Dialog.Close
				class="focus-visible:ring-orange-400 focus-visible:ring-offset-white focus-visible:outline-none absolute right-5 top-5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] {closeClass}"
				{...closeProps}
			>
				<div>
					<X class="text-orange-400 w-5 h-5" />
					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
