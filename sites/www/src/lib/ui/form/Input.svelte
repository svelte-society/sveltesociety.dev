<script lang="ts">
interface TextInputProps {
	label?: string
	value?: string
	description?: string
	errors?: string[]
	initial?: string
	placeholder?: string
	name: string
	constraints?: any
	disabled?: boolean
	type: string
	magic?: () => string
}
let {
	name,
	value = $bindable(),
	label,
	description,
	placeholder = 'Some text...',
	constraints,
	errors,
	disabled,
	type = 'text',
	magic = undefined
}: TextInputProps = $props()
let inputElement: HTMLInputElement

let showClearButton = $derived(value?.length > 0)

function clearText() {
	value = ''
	inputElement.focus()
}
</script>

<div class="flex flex-col gap-1">
	{#if label}
		<label class="text-xs font-medium text-slate-800 outline-none" for={name}>{label}</label>
	{/if}
	<div class="relative">
		<input
			{type}
			bind:this={inputElement}
			aria-invalid={errors ? 'true' : undefined}
			{disabled}
			bind:value
			{placeholder}
			class="{{ 'border-red-300 bg-red-50 text-red-600': errors }}w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 pr-7 text-sm text-slate-800 placeholder-slate-500"
			{name}
			{...constraints}
		/>
		{#if magic && !disabled}
			<button
				type="button"
				class="absolute {showClearButton ? 'right-7' : 'right-2.5'} top-1/2 -translate-y-1/2"
				onclick={() => (value = magic())}
				aria-label="Autofill"
			>
				<svg
					width="24px"
					height="24px"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M4.5 22V17M4.5 7V2M2 4.5H7M2 19.5H7M13 3L11.2658 7.50886C10.9838 8.24209 10.8428 8.60871 10.6235 8.91709C10.4292 9.1904 10.1904 9.42919 9.91709 9.62353C9.60871 9.8428 9.24209 9.98381 8.50886 10.2658L4 12L8.50886 13.7342C9.24209 14.0162 9.60871 14.1572 9.91709 14.3765C10.1904 14.5708 10.4292 14.8096 10.6235 15.0829C10.8428 15.3913 10.9838 15.7579 11.2658 16.4911L13 21L14.7342 16.4911C15.0162 15.7579 15.1572 15.3913 15.3765 15.0829C15.5708 14.8096 15.8096 14.5708 16.0829 14.3765C16.3913 14.1572 16.7579 14.0162 17.4911 13.7342L22 12L17.4911 10.2658C16.7579 9.98381 16.3913 9.8428 16.0829 9.62353C15.8096 9.42919 15.5708 9.1904 15.3765 8.91709C15.1572 8.60871 15.0162 8.24209 14.7342 7.50886L13 3Z"
						stroke="#94A3B8"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		{/if}
		{#if showClearButton && !disabled}
			<button
				type="button"
				class="absolute right-2.5 top-1/2 -translate-y-1/2"
				onclick={clearText}
				aria-label="Clear input"
			>
				<svg
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Clear text</title>
					<g clip-path="url(#clip0_426_221)">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M1.00538 1.02734C1.16911 0.864159 1.39107 0.772501 1.62248 0.772501C1.85389 0.772501 2.07583 0.864159 2.23957 1.02734L5.98872 4.76845L9.73786 1.02734C9.81785 0.941723 9.91426 0.873058 10.0214 0.825435C10.1285 0.777811 10.2441 0.752204 10.3614 0.750136C10.4786 0.748068 10.595 0.769597 10.7038 0.813421C10.8125 0.857246 10.9113 0.922471 10.9942 1.00522C11.0772 1.08796 11.1425 1.18653 11.1864 1.29503C11.2303 1.40353 11.252 1.51975 11.2499 1.63674C11.2478 1.75375 11.2221 1.86913 11.1744 1.97602C11.1267 2.08291 11.0579 2.17911 10.9721 2.25888L7.22291 5.99999L10.9721 9.7411C11.0579 9.82092 11.1267 9.91712 11.1744 10.024C11.2221 10.1309 11.2478 10.2463 11.2499 10.3633C11.252 10.4803 11.2303 10.5964 11.1864 10.705C11.1425 10.8135 11.0772 10.912 10.9942 10.9947C10.9113 11.0776 10.8125 11.1427 10.7038 11.1865C10.595 11.2303 10.4786 11.252 10.3614 11.2499C10.2441 11.2478 10.1285 11.2222 10.0214 11.1746C9.91426 11.1269 9.81785 11.0583 9.73786 10.9726L5.98872 7.23154L2.23957 10.9726C2.07403 11.1266 1.85508 11.2104 1.62885 11.2064C1.40262 11.2023 1.18678 11.1109 1.02677 10.9513C0.866782 10.7916 0.775138 10.5762 0.771144 10.3505C0.767151 10.1247 0.851134 9.90631 1.00538 9.7411L4.75453 5.99999L1.00538 2.25888C0.841854 2.09551 0.75 1.87403 0.75 1.64311C0.75 1.4122 0.841854 1.19073 1.00538 1.02734Z"
							fill="#94A3B8"
						/>
					</g>
					<defs>
						<clipPath id="clip0_426_221">
							<rect width="12" height="12" fill="white" />
						</clipPath>
					</defs>
				</svg>
			</button>
		{/if}
	</div>
	{#if errors}
		<div class="{{ 'text-red-600': errors}}text-xs text-slate-500" >
			{errors}
		</div>
	{:else if description}
		<div class="{{ 'text-red-600': errors}}text-xs text-slate-500">
			{description}
		</div>
	{/if}
</div>
