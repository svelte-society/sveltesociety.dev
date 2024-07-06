<script>
	let { data } = $props();
</script>

<h1 class="mb-6 text-3xl font-bold text-gray-800">Dashboard</h1>
<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
	<!-- Existing cards -->
	<div class="rounded-lg bg-white p-6 shadow-md">
		<h3 class="mb-4 text-xl font-semibold text-gray-800">User Statistics</h3>
		<div class="text-4xl font-bold text-blue-600">{data.users}</div>
		<p class="text-gray-600">Total Users</p>
	</div>
	<div class="rounded-lg bg-white p-6 shadow-md">
		<h3 class="mb-4 text-xl font-semibold text-gray-800">Active Roles</h3>
		<div class="text-4xl font-bold text-green-600">{data.roles}</div>
		<p class="text-gray-600">Current Roles</p>
	</div>

	<!-- Content Metrics Card -->
	<div class="rounded-lg bg-white p-6 shadow-md">
		<h3 class="mb-4 text-xl font-semibold text-gray-800">Content Metrics</h3>
		<ul class="space-y-2">
			<li class="flex justify-between">
				<span class="text-gray-600">Total posts:</span>
				<span class="font-semibold text-gray-800">10,000</span>
			</li>
			<li class="flex justify-between">
				<span class="text-gray-600">Posts per day:</span>
				<span class="font-semibold text-gray-800">250</span>
			</li>
			<li class="flex justify-between">
				<span class="text-gray-600">Comments per day:</span>
				<span class="font-semibold text-gray-800">1,500</span>
			</li>
			<li class="flex justify-between">
				<span class="text-gray-600">Popular posts:</span>
				<a href="/admin" class="font-semibold text-blue-600 hover:underline">View top 10</a>
			</li>
			<li class="flex justify-between">
				<span class="text-gray-600">Categories:</span>
				<a href="/admin" class="font-semibold text-blue-600 hover:underline">View chart</a>
			</li>
		</ul>
	</div>

	<!-- Moderation Queue Card -->
	<div class="rounded-lg bg-white p-6 shadow-md">
		<h3 class="mb-4 text-xl font-semibold text-gray-800">Moderation Queue</h3>
		<ul class="space-y-2">
			<li class="flex justify-between">
				<span class="text-gray-600">Reported items:</span>
				<span class="font-semibold text-gray-800">50</span>
			</li>
			<li class="flex justify-between">
				<span class="text-gray-600">Awaiting moderation:</span>
				<span class="font-semibold text-gray-800">25</span>
			</li>
			<li class="flex justify-between">
				<span class="text-gray-600">Banned users:</span>
				<a href="/admin" class="font-semibold text-blue-600 hover:underline">View list</a>
			</li>
		</ul>
	</div>
</div>
