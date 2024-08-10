<script lang="ts">
	import Button from '$lib/ui/Button.svelte';

	type TimeFrame = 'day' | 'week' | 'month' | 'year';
	let timeFrame: TimeFrame = 'week';

	function handleTimeFrameChange(newTimeFrame: TimeFrame) {
		timeFrame = newTimeFrame;
		// In a real application, you might want to trigger a data fetch here
	}

	const statCards = [
		{ title: 'Posts', color: 'bg-blue-100' },
		{ title: 'Likes', color: 'bg-green-100' },
		{ title: 'Saves', color: 'bg-yellow-100' },
		{ title: 'Collections', color: 'bg-purple-100' },
		{ title: 'Users', color: 'bg-red-100' }
	];

	const chartCards = [
		{ title: 'Activity Over Time', color: 'bg-indigo-50' },
		{ title: 'Engagement Breakdown', color: 'bg-pink-50' }
	];
</script>

<div class="container mx-auto px-2 py-4">
	<div class="mb-4 flex flex-wrap items-center justify-between gap-2">
		<h1 class="text-xl font-bold">Analytics Dashboard</h1>
		<div class="flex flex-wrap gap-2">
			<Button small primary={timeFrame === 'day'} on:click={() => handleTimeFrameChange('day')}
				>Day</Button
			>
			<Button small primary={timeFrame === 'week'} on:click={() => handleTimeFrameChange('week')}
				>Week</Button
			>
			<Button small primary={timeFrame === 'month'} on:click={() => handleTimeFrameChange('month')}
				>Month</Button
			>
			<Button small primary={timeFrame === 'year'} on:click={() => handleTimeFrameChange('year')}
				>Year</Button
			>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
		{#each statCards as { title, color }}
			<div class="rounded-lg p-4 shadow-sm {color}">
				<h3 class="text-sm font-medium text-gray-800">{title}</h3>
				<p class="mt-2 text-2xl font-semibold text-gray-900">...</p>
			</div>
		{/each}
	</div>

	<div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
		{#each chartCards as { title, color }}
			<div class="rounded-lg p-4 shadow-sm {color}">
				<h2 class="mb-4 text-lg font-semibold">{title}</h2>
				<div class="flex h-64 w-full items-center justify-center bg-gray-200">
					<p class="text-gray-500">Chart placeholder</p>
				</div>
			</div>
		{/each}
	</div>

	<div class="mt-8 rounded-lg bg-white p-4 shadow-sm">
		<h2 class="mb-4 text-lg font-semibold">Data Table</h2>
		<div class="flex h-64 w-full items-center justify-center bg-gray-100">
			<p class="text-gray-500">Table placeholder</p>
		</div>
	</div>
</div>
