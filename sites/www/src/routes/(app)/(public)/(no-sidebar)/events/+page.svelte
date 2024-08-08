<script lang="ts">
	import Button from '$lib/ui/Button.svelte';

	// Mock data for events and meetups
	const meetups = [
		{ id: 1, name: 'Svelte NYC', location: 'New York City', members: 500 },
		{ id: 2, name: 'Svelte London', location: 'London', members: 450 },
		{ id: 3, name: 'Svelte Berlin', location: 'Berlin', members: 300 }
	];

	const events = [
		{ id: 1, title: 'Introduction to Svelte 5', date: '2024-09-15', meetupId: 1 },
		{ id: 2, title: 'Advanced State Management in Svelte', date: '2024-09-20', meetupId: 2 },
		{ id: 3, title: 'Building Accessible Svelte Apps', date: '2024-09-25', meetupId: 3 },
		{ id: 4, title: 'Svelte and TypeScript Workshop', date: '2024-10-01', meetupId: 1 }
	];
</script>

<div class="grid gap-6">
	<h1 class="text-2xl font-bold">Svelte Events and Meetups</h1>

	<p>
		Join Svelte enthusiasts around the world for exciting events and meetups. Learn, share, and
		connect with the Svelte community!
	</p>

	<div>
		<h2 class="mb-4 text-xl font-semibold">Upcoming Events</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each events as event}
				<div class="rounded-lg bg-zinc-50 p-5">
					<div class="mb-2 grid grid-cols-[1fr_auto] items-start justify-between text-xs">
						<span class="font-semibold capitalize">Event</span>
						<span class="text-gray-500">{event.date}</span>
					</div>
					<h3 class="mb-2 text-xl font-bold">{event.title}</h3>
					<p class="mb-4">Hosted by: {meetups.find((m) => m.id === event.meetupId)?.name}</p>
					<Button primary small>Register</Button>
				</div>
			{/each}
		</div>
	</div>

	<div>
		<h2 class="mb-4 text-xl font-semibold">Svelte Meetups</h2>
		<div class="grid gap-6">
			{#each meetups as meetup}
				<div class="rounded-lg bg-zinc-50 p-5">
					<div class="mb-2 grid grid-cols-[1fr_auto] items-start justify-between text-xs">
						<span class="font-semibold capitalize">Meetup</span>
						<span class="text-gray-500">{meetup.location}</span>
					</div>
					<h3 class="mb-2 text-xl font-bold">{meetup.name}</h3>
					<p class="mb-4">Members: {meetup.members}</p>
					<Button secondary small>Join Group</Button>
				</div>
			{/each}
		</div>
	</div>
</div>
