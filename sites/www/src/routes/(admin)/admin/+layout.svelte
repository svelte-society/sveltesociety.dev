<script lang="ts">
	let { children } = $props();
</script>

<div class="flex h-screen bg-gray-100">
	<!-- Sidebar -->
	<div class="w-64 bg-white shadow-md">
		<div class="p-4">
			<h2 class="mb-4 text-xl font-bold text-gray-800">Admin Panel</h2>
			<nav>
				<ul class="space-y-2">
					<li>
						<a
							href="/admin"
							class="flex items-center rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-200"
						>
							<svg
								class="mr-2 h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"
								></path>
							</svg>
							Dashboard
						</a>
					</li>
					<li>
						<a
							href="/admin/users"
							class="flex items-center rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-200"
						>
							<svg
								class="mr-2 h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
								></path>
							</svg>
							Users
						</a>
					</li>
					<li>
						<a
							href="/admin/roles"
							class="flex items-center rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-200"
						>
							<svg
								class="mr-2 h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
								></path>
							</svg>
							Roles
						</a>
					</li>
				</ul>
			</nav>
		</div>
		<div class="absolute bottom-0 w-64 border-t border-gray-200 p-4">
			<a
				href="/"
				class="flex items-center rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-200"
			>
				<svg
					class="mr-2 h-6 w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					></path>
				</svg>
				Back to Home
			</a>
		</div>
	</div>

	<!-- Main content -->
	<div class="flex-1 overflow-y-auto">
		<div class="p-8">
			{@render children()}
		</div>
	</div>
</div>
