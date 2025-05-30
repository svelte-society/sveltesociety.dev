<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte'
	import Avatar from '$lib/ui/Avatar.svelte'
	import type { PageData } from './$types'
	import Calendar from 'phosphor-svelte/lib/Calendar'
	import Article from 'phosphor-svelte/lib/Article'
	import Heart from 'phosphor-svelte/lib/Heart'
	import BookmarkSimple from 'phosphor-svelte/lib/BookmarkSimple'

	let { data }: { data: PageData } = $props()
</script>

<svelte:head>
	<title>{data.user.name || data.user.username} - Svelte Society</title>
	<meta
		name="description"
		content="View {data.user.name ||
			data.user.username}'s profile and contributions to Svelte Society"
	/>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8">
	<!-- User Profile Header -->
	<div class="mb-8 rounded-lg bg-zinc-50 p-6">
		<div class="flex items-start gap-6">
			<Avatar src={data.user.avatar_url} name={data.user.name || data.user.username} />

			<div class="flex-1">
				<h1 class="text-2xl font-bold">{data.user.name || data.user.username}</h1>
				{#if data.user.username}
					<p class="text-gray-600">@{data.user.username}</p>
				{/if}

				{#if data.user.bio}
					<p class="mt-2 text-gray-700">{data.user.bio}</p>
				{/if}

				<div class="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
					{#if data.user.location}
						<span>{data.user.location}</span>
					{/if}

					{#if data.user.twitter}
						<a
							href="https://twitter.com/{data.user.twitter}"
							target="_blank"
							rel="noopener noreferrer"
							class="hover:underline"
						>
							@{data.user.twitter}
						</a>
					{/if}

					<div class="flex items-center gap-1">
						<Calendar size={16} />
						<span
							>Joined {new Date(data.user.created_at).toLocaleDateString('en-US', {
								month: 'long',
								year: 'numeric'
							})}</span
						>
					</div>
				</div>

				{#if data.user.role && data.user.role !== 'member'}
					<div class="mt-2">
						<span class="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
							{data.user.role}
						</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- Stats -->
		<div class="mt-6 grid grid-cols-3 gap-4 border-t pt-6">
			<div class="text-center">
				<div class="flex items-center justify-center gap-2 text-gray-600">
					<Article size={20} />
					<span class="text-2xl font-bold">{data.stats.totalContent}</span>
				</div>
				<p class="text-sm text-gray-600">Posts</p>
			</div>

			<div class="text-center">
				<div class="flex items-center justify-center gap-2 text-gray-600">
					<Heart size={20} />
					<span class="text-2xl font-bold">{data.stats.totalLikes}</span>
				</div>
				<p class="text-sm text-gray-600">Likes received</p>
			</div>

			<div class="text-center">
				<div class="flex items-center justify-center gap-2 text-gray-600">
					<BookmarkSimple size={20} />
					<span class="text-2xl font-bold">{data.stats.totalSaves}</span>
				</div>
				<p class="text-sm text-gray-600">Saves received</p>
			</div>
		</div>
	</div>

	<!-- User's Content -->
	<div>
		<h2 class="mb-4 text-xl font-bold">Recent Posts</h2>

		{#if data.content.length > 0}
			<div class="grid gap-4">
				{#each data.content as content}
					<ContentCard {content} />
				{/each}
			</div>
		{:else}
			<div class="rounded-lg bg-zinc-50 p-8 text-center text-gray-600">
				<p>No posts yet</p>
			</div>
		{/if}
	</div>
</div>
