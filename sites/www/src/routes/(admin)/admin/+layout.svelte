<script lang="ts">
	let { children } = $props();
</script>

<div class="flex h-screen">
	<div class="w-64 bg-gray-100 p-4">
		<h2 class="mb-2 text-lg font-bold">Navigation</h2>
		<nav>
			<ul class="flex flex-col">
				<li class="mb-2">
					<a
						href="/admin"
						class="text-gray-600 transition duration-300 ease-in-out hover:text-gray-900">Admin</a
					>
				</li>
				<li class="mb-2">
					<a
						href="/admin/users"
						class="text-gray-600 transition duration-300 ease-in-out hover:text-gray-900">Users</a
					>
				</li>
				<li class="mb-2">
					<a
						href="/admin/roles"
						class="text-gray-600 transition duration-300 ease-in-out hover:text-gray-900">Roles</a
					>
				</li>
				<li class="mt-2 rounded-sm bg-gray-200 p-2">
					<a href="/" class="text-gray-600 transition duration-300 ease-in-out hover:text-gray-900"
						>Home</a
					>
				</li>
			</ul>
		</nav>
	</div>
	<div class="flex-1 p-4">
		<h1 class="mb-2 text-3xl font-bold">Admin</h1>
		{@render children()}
	</div>
</div>
