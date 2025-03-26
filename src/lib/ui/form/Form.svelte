<script>
	import { setContext } from "svelte";

    let { form, action = false, children } = $props();

    const { enhance } = form

    setContext('form', form)
</script>

<form method="POST" {action} use:enhance class="flex flex-col gap-4">
    {@render children()}
</form>