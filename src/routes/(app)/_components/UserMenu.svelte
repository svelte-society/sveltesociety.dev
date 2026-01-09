<script lang="ts">
	import Avatar from '$lib/ui/Avatar.svelte'
	import Dropdown from '$lib/ui/Dropdown.svelte'
	import SignOut from 'phosphor-svelte/lib/SignOut'
	import GearSix from 'phosphor-svelte/lib/GearSix'
	import Envelope from 'phosphor-svelte/lib/Envelope'

	let { user } = $props()

	let dropdownRef: { close: () => void } | undefined = $state()
</script>

<Dropdown
	bind:this={dropdownRef}
	align="right"
	triggerLabel="User menu"
	triggerTestId="user-menu-trigger"
	triggerClass="flex h-10 w-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent text-sm font-medium select-none focus:outline-2 focus:outline-svelte-300 active:scale-[0.98]"
	menuLabel="User options"
	menuClass="mt-2 w-[229px] rounded-md border border-gray-100 bg-white px-1 py-1.5 shadow-lg"
>
	{#snippet triggerContent()}
		<Avatar src={user.avatar_url} name={user.name} />
	{/snippet}

	<a
		href={`/user/${user.username}`}
		role="menuitem"
		data-testid="profile-menu-item"
		onclick={() => dropdownRef?.close()}
		class="flex h-10 cursor-pointer items-center rounded-sm py-3 pr-1.5 pl-3 text-sm font-medium select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
	>
		<GearSix class="mr-2 size-5" />
		Profile
	</a>
	<a
		href="https://app.useplunk.com/subscribe"
		target="_blank"
		rel="noopener noreferrer"
		role="menuitem"
		data-testid="newsletter-preferences-menu-item"
		onclick={() => dropdownRef?.close()}
		class="flex h-10 cursor-pointer items-center rounded-sm py-3 pr-1.5 pl-3 text-sm font-medium select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
	>
		<Envelope class="mr-2 size-5" />
		Newsletter Preferences
	</a>
	<form method="post" action="/auth/logout" class="contents">
		<button
			type="submit"
			role="menuitem"
			data-testid="logout-menu-item"
			onclick={() => dropdownRef?.close()}
			class="flex h-10 w-full cursor-pointer items-center rounded-sm py-3 pr-1.5 pl-3 text-sm font-medium select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
		>
			<SignOut class="mr-2 size-5" />
			Logout
		</button>
	</form>
</Dropdown>
