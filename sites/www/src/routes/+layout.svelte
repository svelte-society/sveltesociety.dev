<script>
	import { Toaster } from 'svelte-sonner';
	import '../app.pcss';

	const { children } = $props();
</script>

{@render children()}

<Toaster />
