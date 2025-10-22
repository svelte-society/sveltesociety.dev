<script lang="ts">
	import { goto } from '$app/navigation'
	import Avatar from '$lib/ui/Avatar.svelte'
	import { DropdownMenu } from 'bits-ui'

	import SignOut from 'phosphor-svelte/lib/SignOut'
	import GearSix from 'phosphor-svelte/lib/GearSix'
	let { user } = $props()

	let formSubmitButton: HTMLButtonElement
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="border-input h-10 w-10 items-center gap-2 rounded-full border border-transparent text-sm font-medium select-none active:scale-[0.98]"
	>
		<Avatar src={user.avatar_url} name={user.name} size="sm" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class="z-10 w-[229px] rounded-md border border-gray-100 bg-white px-1 py-1.5 shadow-lg outline-hidden focus-visible:outline-hidden"
			sideOffset={8}
		>
			<DropdownMenu.Item
				onSelect={() => goto(`/user/${user.username}`)}
				class="flex h-10 cursor-pointer items-center rounded-sm py-3 pr-1.5 pl-3 text-sm font-medium ring-0! ring-transparent! select-none focus-visible:outline-none data-highlighted:bg-gray-100"
			>
				<div class="flex items-center">
					<GearSix class="mr-2 size-5" />
					Profile
				</div>
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onSelect={() => formSubmitButton.click()}
				class="flex h-10 cursor-pointer items-center rounded-sm py-3 pr-1.5 pl-3 text-sm font-medium ring-0! ring-transparent! select-none focus-visible:outline-none data-highlighted:bg-gray-100"
			>
				<div class="flex items-center">
					<SignOut class="mr-2 size-5" />
					Logout
				</div>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>

<form method="post" action="/auth/logout" class="sr-only">
	<button bind:this={formSubmitButton} type="submit">Logout</button>
</form>
