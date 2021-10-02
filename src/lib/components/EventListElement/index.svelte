<script>
	import Icon from '$lib/components/Icon/index.svelte';
	export let title,
		date,
		url = '';

	const MILLIS_IN_A_DAY = 24 * 60 * 60 * 1000;
	$: isPast = Date.now() - new Date(date).getTime() > MILLIS_IN_A_DAY;

	// function that formats the standard ISO formatted date param in a better to read date format
	function formatDate(inputDate) {
		let rawDate = new Date(inputDate);
		let formattedDate = rawDate.toDateString();
		return formattedDate;
	}
</script>

<article class="event-tile">
	{#if isPast === true}
		<span class="past-event">Past event</span>
	{/if}
	<h2>
		<a href={url}> {title} </a>
	</h2>
	<p>
		<span class="icon-wrapper">
			<Icon name="calendar" width="25px" height="25px" />{formatDate(date)}
		</span>
	</p>
</article>

<style>
	h2 {
		font-size: var(--font-400);
		margin-bottom: var(--s-2);
	}
	.event-tile {
		box-shadow: var(--shadow-dreamy);
		padding: var(--s-8);
		margin-top: var(--s-12);
		border-radius: var(--s-2);
		background: var(--white);
		display: grid;
		gap: var(--s-2);
		justify-items: flex-start;
	}
	.event-tile:hover {
		filter: brightness(1.05);
	}
	.past-event {
		background-color: var(--caution);
		padding: var(--s-1);
		border-radius: var(--s-2);
		margin-bottom: var(--s-4);
		font-size: var(--s-4);
	}

	a {
		text-decoration: none;
	}
	a:hover {
		text-decoration: underline;
	}
	span.icon-wrapper {
		font-family: var(--font-heading);
	}
</style>
