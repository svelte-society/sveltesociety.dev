<script lang="ts">
	import Button from '$lib/ui/Button.svelte';

	let { data } = $props();
</script>

<main class="flex-1 px-4 py-8">
	<h1 class="mb-6 text-2xl font-bold">My Account</h1>

	<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
		<section>
			<h2 class="mb-4 text-xl font-semibold">Profile</h2>
			<div class="rounded-lg bg-white p-6 shadow">
				<div class="mb-4 flex items-center">
					<img src={data.user.avatar_url} alt="User avatar" class="mr-4 h-16 w-16 rounded-full" />
					<div>
						<h3 class="text-lg font-medium">{data.user.name || data.user.username}</h3>
						<p class="text-gray-600">@{data.user.username}</p>
					</div>
				</div>
				<p class="mb-4 text-gray-700">{data.user.bio}</p>
				<div class="mb-4 space-y-2 text-sm text-gray-600">
					{#if data.user.location}
						<p class="flex items-center">
							<span class="mr-2">📍</span>
							<span>{data.user.location}</span>
						</p>
					{/if}
					{#if data.user.twitter}
						<p class="flex items-center">
							<span class="mr-2">🐦</span>
							<a
								href="https://twitter.com/{data.user.twitter}"
								target="_blank"
								rel="noopener noreferrer"
								class="hover:text-svelte-900 transition-colors duration-200"
							>
								@{data.user.twitter}
							</a>
						</p>
					{/if}
					<p class="flex items-center">
						<span class="mr-2">🕒</span>
						<span>Joined {new Date(data.user.created_at).toLocaleDateString()}</span>
					</p>
				</div>

				<Button href="/account/edit" primary small>Edit Profile</Button>
			</div>
		</section>

		<section>
			<h2 class="mb-4 text-xl font-semibold">Stats</h2>
			<div class="rounded-lg bg-white p-6 shadow">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<h3 class="mb-2 text-lg font-medium">Posts</h3>
						<p class="text-svelte-900 text-3xl font-bold">
							{data.user.authoredContents?.length || 0}
						</p>
					</div>
					<div>
						<h3 class="mb-2 text-lg font-medium">Collections</h3>
						<p class="text-svelte-900 text-3xl font-bold">
							{data.user.authoredCollections?.length || 0}
						</p>
					</div>
					<div>
						<h3 class="mb-2 text-lg font-medium">Likes Given</h3>
						<p class="text-svelte-900 text-3xl font-bold">{data.user.likes?.length || 0}</p>
					</div>
					<!-- You might want to add a field for received likes if available -->
					<div>
						<h3 class="mb-2 text-lg font-medium">Role</h3>
						<p class="text-svelte-900 text-xl font-bold">{data.user.roles?.name || 'User'}</p>
					</div>
				</div>
			</div>
		</section>
	</div>

	<section class="mt-12">
		<h2 class="mb-4 text-xl font-semibold">My Posts</h2>
		<div class="space-y-6">
			{#each data.user.authoredContents || [] as post}
				<article class="rounded-lg bg-white p-6 shadow">
					<h3 class="mb-2 text-lg font-medium">{post.title}</h3>
					<p class="mb-4 text-gray-600">{post.description}</p>
					<div class="flex items-center justify-between text-sm text-gray-500">
						<span>{new Date(post.created_at).toLocaleDateString()}</span>
						<div class="flex space-x-4">
							<span class="flex items-center">
								<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
									<!-- Heart icon -->
								</svg>
								{post.likes}
							</span>
							<span class="flex items-center">
								<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
									<!-- Bookmark icon -->
								</svg>
								{post.saves}
							</span>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</section>
</main>
