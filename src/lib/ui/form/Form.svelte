<script>
	import { setContext } from "svelte";

    let { form, action, children } = $props();

    const { enhance } = form

    setContext('form', form)
</script>

<form method="POST" {action} use:enhance>
    {@render children()}
</form>