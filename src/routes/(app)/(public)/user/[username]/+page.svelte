<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte'
	import Avatar from '$lib/ui/Avatar.svelte'
	import type { PageData } from './$types'
	import Calendar from 'phosphor-svelte/lib/Calendar'
	import Article from 'phosphor-svelte/lib/Article'
	import Heart from 'phosphor-svelte/lib/Heart'
	import BookmarkSimple from 'phosphor-svelte/lib/BookmarkSimple'

	let { data }: { data: PageData } = $props()

	const displayName = $derived(data.user.name || data.user.username)
	const joinDate = $derived(
		new Date(data.user.created_at).toLocaleDateString('en-US', {
			month: 'short',
			year: 'numeric'
		})
	)
</script>

<svelte:head>
	<title>{displayName} - Svelte Society</title>
	<meta name="description" content="View {displayName}'s profile and contributions to Svelte Society" />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 pb-8">
	<div class="mb-8 rounded-lg bg-zinc-50 p-4 sm:p-6">
		<!-- Header: Avatar + Name -->
		<div class="flex items-start gap-4 sm:gap-6">
			<Avatar src={data.user.avatar_url} name={displayName} />

			<div class="min-w-0 flex-1">
				<h1 class="truncate text-lg font-bold sm:text-2xl">{displayName}</h1>
				{#if data.user.username}
					<p class="truncate text-sm text-gray-600 sm:text-base">@{data.user.username}</p>
				{/if}

				{#if data.user.bio}
					<p class="mt-2 text-sm text-gray-700 sm:text-base">{data.user.bio}</p>
				{/if}

				<!-- Meta info -->
				<div class="mt-3 flex flex-wrap gap-3 text-xs text-gray-600 sm:mt-4 sm:gap-4 sm:text-sm">
					{#if data.user.location}
						<span class="flex items-center gap-1">
							<svg class="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
									clip-rule="evenodd"
								/>
							</svg>
							{data.user.location}
						</span>
					{/if}

					{#if data.user.twitter}
						<a
							href="https://twitter.com/{data.user.twitter}"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-1 hover:underline"
						>
							<svg class="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
								/>
							</svg>
							@{data.user.twitter}
						</a>
					{/if}

					<span class="flex items-center gap-1">
						<Calendar size={12} class="sm:hidden" />
						<Calendar size={16} class="hidden sm:block" />
						Joined {joinDate}
					</span>
				</div>

				{#if data.user.role && data.user.role !== 'member'}
					<span
						class="mt-2 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 sm:mt-3 sm:px-3 sm:py-1"
					>
						{data.user.role}
					</span>
				{/if}
			</div>
		</div>

		<!-- Stats -->
		<div class="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-white p-3 sm:mt-6 sm:gap-4 sm:border-t sm:bg-transparent sm:pt-6">
			{#each [
				{ icon: Article, value: data.stats.totalContent, label: 'Posts' },
				{ icon: Heart, value: data.stats.totalLikes, label: 'Likes' },
				{ icon: BookmarkSimple, value: data.stats.totalSaves, label: 'Saves' }
			] as stat}
				<div class="text-center">
					<div class="flex flex-col items-center gap-1 text-gray-600 sm:flex-row sm:justify-center sm:gap-2">
						<stat.icon size={16} class="sm:hidden" />
						<stat.icon size={20} class="hidden sm:block" />
						<span class="text-lg font-bold sm:text-2xl">{stat.value}</span>
					</div>
					<p class="text-xs text-gray-600 sm:text-sm">{stat.label}</p>
				</div>
			{/each}
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
