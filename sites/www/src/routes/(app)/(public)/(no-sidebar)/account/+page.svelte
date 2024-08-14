<script lang="ts">
	import Button from '$lib/ui/Button.svelte';

	let { data } = $props();
</script>

<main class="flex-1 px-4 py-8">
	<h1 class="mb-6 text-2xl font-bold">My Account</h1>
	<div class="grid gap-2 rounded-lg bg-zinc-50 p-5">
		<div class="px-4 py-5 sm:p-6">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-2xl font-bold text-gray-900">Profile</h2>
				<Button primary href="/account/edit">Edit Profile</Button>
			</div>

			<div class="mb-8 flex flex-col items-center sm:flex-row sm:space-x-6">
				<div class="mb-4 h-24 w-24 overflow-hidden rounded-full bg-gray-200 sm:mb-0">
					<img src={data.user.avatar_url} alt="User avatar" class="h-full w-full object-cover" />
				</div>
				<div class="text-center sm:text-left">
					<h3 class="text-xl font-semibold text-gray-900">
						{data.user.name || data.user.username}
					</h3>
					<p class="text-sm text-gray-500">@{data.user.username}</p>
					<p class="mt-2 text-sm text-gray-600">{data.user.bio}</p>
				</div>
			</div>

			<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div class="rounded-lg bg-gray-50 p-4">
					<dt class="text-sm font-medium text-gray-500">Location</dt>
					<dd class="mt-1 text-lg font-semibold text-gray-900">
						{data.user.location || 'Not specified'}
					</dd>
				</div>
				<div class="rounded-lg bg-gray-50 p-4">
					<dt class="text-sm font-medium text-gray-500">Twitter</dt>
					<dd class="mt-1 text-lg font-semibold text-gray-900">
						{#if data.user.twitter}
							<a
								href="https://twitter.com/{data.user.twitter}"
								target="_blank"
								rel="noopener noreferrer"
								class="text-svelte-900 hover:underline"
							>
								@{data.user.twitter}
							</a>
						{:else}
							Not linked
						{/if}
					</dd>
				</div>
				<div class="rounded-lg bg-gray-50 p-4">
					<dt class="text-sm font-medium text-gray-500">Joined</dt>
					<dd class="mt-1 text-lg font-semibold text-gray-900">
						{new Date(data.user.created_at).toLocaleDateString()}
					</dd>
				</div>
				<div class="rounded-lg bg-gray-50 p-4">
					<dt class="text-sm font-medium text-gray-500">Role</dt>
					<dd class="mt-1 text-lg font-semibold text-gray-900">
						<span
							class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
						>
							Member
						</span>
					</dd>
				</div>
			</div>

			<div>
				<h4 class="mb-4 text-lg font-semibold text-gray-900">Stats</h4>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div class="rounded-lg bg-white p-4">
						<dt class="text-sm font-medium text-gray-500">Total Posts</dt>
						<dd class="mt-1 text-3xl font-semibold text-gray-900">
							{data.user.authoredContents?.length || 0}
						</dd>
						<div class="mt-2 h-2.5 w-full rounded-full bg-gray-200">
							<div
								class="h-2.5 rounded-full bg-blue-600"
								style="width: {Math.min(
									((data.user.authoredContents?.length || 0) / 100) * 100,
									100
								)}%"
							></div>
						</div>
					</div>
					<div class="rounded-lg bg-white p-4">
						<dt class="text-sm font-medium text-gray-500">Collections</dt>
						<dd class="mt-1 text-3xl font-semibold text-gray-900">
							{data.user.authoredCollections?.length || 0}
						</dd>
						<div class="mt-2 h-2.5 w-full rounded-full bg-gray-200">
							<div
								class="h-2.5 rounded-full bg-green-600"
								style="width: {Math.min(
									((data.user.authoredCollections?.length || 0) / 20) * 100,
									100
								)}%"
							></div>
						</div>
					</div>
					<div class="rounded-lg bg-white p-4">
						<dt class="text-sm font-medium text-gray-500">Likes Given</dt>
						<dd class="mt-1 text-3xl font-semibold text-gray-900">
							{data.user_likes || 0}
						</dd>
						<div class="mt-2 h-2.5 w-full rounded-full bg-gray-200">
							<div
								class="h-2.5 rounded-full bg-purple-600"
								style="width: {Math.min(((data.user_likes || 0) / 500) * 100, 100)}%"
							></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<section class="mt-12">
		<h2 class="mb-4 text-xl font-semibold">My Posts</h2>
		<div class="space-y-6">
			{#each data.user.authoredContents || [] as post}
				<article class="grid gap-2 rounded-lg bg-zinc-50 p-5">
					<div class="mb-2 grid grid-cols-[1fr_auto] items-start justify-between text-xs">
						<div class="flex">
							<span class="font-semibold capitalize">post</span>
							<span class="flex text-gray-500">
								<span
									>by {data.user.name || data.user.username} • {new Date(
										post.created_at
									).toLocaleDateString()} •&nbsp;</span
								>
								<span class="flex items-center gap-1">
									{post.views || 0}
									<svg
										width="12"
										height="12"
										viewBox="0 0 12 12"
										xmlns="http://www.w3.org/2000/svg"
									>
										<title>views</title>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M1.25937 5.94874C1.56882 5.48321 2.19069 4.63614 3.03377 3.91108C3.882 3.18157 4.89578 2.625 6.00025 2.625C7.10472 2.625 8.11854 3.18157 8.96672 3.91108C9.80979 4.63614 10.4317 5.48321 10.7411 5.94874C10.7627 5.98125 10.7627 6.01875 10.7411 6.05126C10.4317 6.51679 9.80979 7.36386 8.96672 8.0889C8.11854 8.81843 7.10472 9.375 6.00025 9.375C4.89578 9.375 3.882 8.81843 3.03377 8.0889C2.19069 7.36386 1.56882 6.51679 1.25937 6.05126C1.23776 6.01875 1.23776 5.98125 1.25937 5.94874ZM6.00025 1.5C4.51423 1.5 3.24714 2.24375 2.30021 3.05813C1.34813 3.87695 0.660585 4.8173 0.32247 5.32597C0.0500614 5.73578 0.0500625 6.26422 0.32247 6.67403C0.660585 7.1827 1.34813 8.12302 2.30021 8.94187C3.24714 9.75622 4.51423 10.5 6.00025 10.5C7.48627 10.5 8.75334 9.75622 9.70029 8.94187C10.6523 8.12302 11.3399 7.1827 11.678 6.67403C11.9504 6.26422 11.9504 5.73578 11.678 5.32597C11.3399 4.8173 10.6523 3.87695 9.70029 3.05813C8.75334 2.24375 7.48627 1.5 6.00025 1.5ZM6.00024 7.5C6.82867 7.5 7.50024 6.82843 7.50024 6C7.50024 5.17157 6.82867 4.5 6.00024 4.5C5.17182 4.5 4.50024 5.17157 4.50024 6C4.50024 6.82843 5.17182 7.5 6.00024 7.5Z"
											fill="#64748B"
										></path>
									</svg>
								</span>
							</span>
						</div>
						<div class="flex items-center space-x-4">
							<button
								class="-mx-2 -my-1 flex items-center gap-1 rounded-md px-2 py-1 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
								aria-label="Like post"
							>
								<svg
									width="12"
									height="12"
									viewBox="0 0 12 12"
									xmlns="http://www.w3.org/2000/svg"
									class="mr-0.5"
								>
									<title>Like</title>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M6.62532 0.049567C5.62075 -0.0649162 4.87498 0.78591 4.87498 1.68679V2.06223C4.87498 3.05844 4.38994 3.6545 3.88685 4.02214C3.64068 4.20203 3.39161 4.32474 3.19794 4.40354C2.97064 4.01263 2.54726 3.74982 2.0625 3.74982H1.3125C0.587626 3.74982 0 4.33745 0 5.06232V10.6874C0 11.4122 0.587626 11.9999 1.3125 11.9999H2.0625C2.64352 11.9999 3.13637 11.6223 3.3091 11.0991C3.70246 11.1553 4.10958 11.2706 4.60301 11.4104L4.60316 11.4104C4.71683 11.4426 4.83508 11.4761 4.95881 11.5105C5.82428 11.7509 6.86444 11.9997 8.25 11.9997C9.52927 11.9997 10.4772 11.8855 11.0411 11.1453C11.306 10.7978 11.4439 10.3638 11.5427 9.89123C11.6307 9.47055 11.6986 8.95845 11.7771 8.3661L11.8075 8.1366C11.9944 6.73531 12.0063 5.64813 11.6661 4.89976C11.4831 4.49729 11.1996 4.1928 10.8137 3.99965C10.443 3.81409 10.0148 3.74973 9.5625 3.74973H8.49578L8.50702 3.66548V3.66547C8.5593 3.2768 8.625 2.78842 8.625 2.43723C8.625 1.74608 8.51153 1.14827 8.1333 0.71266C7.74983 0.270907 7.1979 0.114819 6.62532 0.049567Z"
										fill="currentColor"
									></path>
								</svg>
								{post.likes}
							</button>
							<button
								class="-mx-2 -my-1 flex items-center gap-1 rounded-md px-2 py-1 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
								aria-label="Save post"
							>
								<svg
									width="12"
									height="12"
									viewBox="0 0 12 12"
									xmlns="http://www.w3.org/2000/svg"
									class="mr-0.5"
								>
									<title>Save</title>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M3.5625 1.875C3.45895 1.875 3.375 1.95895 3.375 2.0625V9.4956L5.64242 7.62832C5.85012 7.45723 6.14988 7.45723 6.35758 7.62832L8.625 9.4956V2.0625C8.625 1.95895 8.54108 1.875 8.4375 1.875H3.5625ZM2.25 2.0625C2.25 1.33763 2.83763 0.75 3.5625 0.75H8.4375C9.16237 0.75 9.75 1.33763 9.75 2.0625V10.6875C9.75 10.9052 9.62445 11.1033 9.42758 11.1962C9.2307 11.2891 8.99797 11.26 8.8299 11.1217L6 8.7912L3.17008 11.1217C3.00206 11.26 2.76928 11.2891 2.57243 11.1962C2.37558 11.1033 2.25 10.9052 2.25 10.6875V2.0625Z"
										fill="currentColor"
									></path>
								</svg>
								{post.saves}
							</button>
						</div>
					</div>
					<h2 class="mb-2 text-xl font-bold">
						<a href="/post/{post.id}">{post.title}</a>
					</h2>
					<p>{post.description}</p>
					<div class="mt-4 grid grid-cols-[1fr_auto] items-start justify-between">
						<div class="flex space-x-2">
							<div class="flex flex-wrap gap-2">
								{#each post.tags || [] as tag}
									<a
										href="/tags/{tag}"
										class="flex items-center gap-0.5 rounded border-2 border-svelte-100 bg-svelte-100 px-1 py-0.5 text-xs text-svelte-900"
									>
										#{tag}
									</a>
								{/each}
							</div>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</section>
</main>
