<script lang="ts">
	import { goto } from '$app/navigation';
    import Avatar from '$lib/ui/Avatar.svelte';
    import { DropdownMenu } from "bits-ui";
	import { SignOut, GearSix } from 'phosphor-svelte';
   
    let { user } = $props();

    let formSubmitButton: HTMLButtonElement
  </script>
   
  <DropdownMenu.Root>
    <DropdownMenu.Trigger
      class="border-input items-center gap-2 h-10 w-10 select-none border border-transparent rounded-full text-sm font-medium active:scale-[0.98]"
    >
        <Avatar src={user.avatar_url} name={user.name} size="sm" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        class="border-gray-100 bg-white shadow-lg outline-hidden focus-visible:outline-hidden w-[229px] rounded-md border px-1 py-1.5"
        sideOffset={8}
      >
        <DropdownMenu.Item
          onSelect={() => goto('/account')}
          class="cursor-pointer rounded-sm data-highlighted:bg-gray-100 ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
        >
          <div class="flex items-center">
            <GearSix class="mr-2 size-5" />
            Profile
          </div>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onSelect={() => formSubmitButton.click()}
          class="cursor-pointer rounded-sm data-highlighted:bg-gray-100 ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
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