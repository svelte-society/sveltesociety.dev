<script>
	import Icon from '$lib/components/Icon/index.svelte';
	export let title,
		date,
		url = '';
	export let isPast = false;

	// function that formats the standard ISO formatted date param in a better to read date format
	function formatDate(inputDate) {
		let rawDate = new Date(inputDate);
		let formattedDate = rawDate.toDateString();
		return formattedDate;
	}

</script>

<figure class="event-tile">
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
</figure>

<style>
  h2 {
    font-size: var(--font-300);
  }
	.event-tile {
		--tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
			var(--tw-shadow);
		padding: 2rem;
		margin-top: 3rem;
		border-radius: 0.5rem;
		background: var(--white);
    display: grid;
    gap: var(--s-2);
    justify-items: flex-start;
	}
	.event-tile:hover {
		filter: brightness(1.1);
	}
	.past-event {
		background-color: var(--caution);
		padding: 0.3rem;
		border-radius: 0.6rem;
		margin-bottom: 1rem;
	}

	a {
		text-decoration: none;
	}
	a:hover {
		text-decoration: underline;
	}

	/* mobile design */
	@media only screen and (max-width: 768px) {
		.wrapper {
			display: flex;
			flex-direction: column;
		}
		.society-wrapper {
			flex: 0 1 auto;
			margin-top: 5%;
			padding: 2rem;
			--tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
			box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
				var(--tw-shadow);
		}
	}

</style>
