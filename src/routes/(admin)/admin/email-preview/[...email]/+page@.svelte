<script lang="ts">
	import { EmailPreview } from 'better-svelte-email/preview'
	import { page } from '$app/state'
</script>

<EmailPreview {page} />
