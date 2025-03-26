<script lang="ts">
	import Button from '$lib/ui/Button.svelte'

	let { data } = $props()

	const statCards = [
		{ title: 'Posts', color: 'bg-blue-100', count: 0, icon: 'post' },
		{ title: 'Likes', color: 'bg-green-100', count: data.counts.like, icon: 'thumb-up' },
		{ title: 'Saves', color: 'bg-yellow-100', count: data.counts.save, icon: 'bookmark' },
		{ title: 'Collections', color: 'bg-purple-100', count: 0, icon: 'collection' },
		{ title: 'Users', color: 'bg-red-100', count: data.counts.signup, icon: 'user' }
	]

	const chartCards = [
		{ title: 'Activity Over Time', color: 'bg-indigo-50', data: data.time_series }
	]
</script>

<div class="container mx-auto px-2 py-4">
	<form
		class="mb-4 flex flex-wrap items-center justify-between gap-2"
		method="GET"
		action="/admin/analytics"
		data-sveltekit-replacestate
		data-sveltekit-keepfocus
	>
		<h1 class="text-xl font-bold">Analytics Dashboard</h1>
		<div class="flex flex-wrap gap-2">
			<Button type="submit" small primary={data.interval === 'day'} value="day" name="interval"
				>Day</Button
			>
			<Button type="submit" small primary={data.interval === 'week'} value="week" name="interval"
				>Week</Button
			>
			<Button type="submit" small primary={data.interval === 'month'} value="month" name="interval"
				>Month</Button
			>
			<Button type="submit" small primary={data.interval === 'year'} value="year" name="interval"
				>Year</Button
			>
		</div>
	</form>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
		{#each statCards as { title, color, count }}
			<div class="rounded-lg p-4 shadow-sm {color}">
				<h3 class="text-sm font-medium text-gray-800">{title}</h3>
				<p class="mt-2 text-2xl font-semibold text-gray-900">{count}</p>
			</div>
		{/each}
	</div>

	<div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
		{#each chartCards as { title, color, data }}
			<div class="rounded-lg p-4 shadow-sm {color}">
				<h2 class="mb-4 text-lg font-semibold">{title}</h2>
				<div class="flex h-64 w-full items-center justify-center bg-gray-200">Placeholder</div>
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
