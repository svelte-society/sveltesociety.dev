<script lang="ts">
	import { page } from '$app/state'
	import { Seo, SEO_CONFIG } from '$lib/seo'
	import Header from './_components/Header.svelte'
	import LeftSidebar from './_components/LeftSidebar.svelte'
	import RightSidebar from './_components/RightSidebar.svelte'
	import MobileMenu from './_components/MobileMenu.svelte'
	import {
		getTags,
		getUpcomingEvents,
		getHeaderAnnouncement,
		getUser,
		getSidebarShortcuts,
		getSidebarJobs
	} from './data.remote'

	let { children } = $props()

	let user = $derived(await getUser())

	const fallbackMeta = {
		title: 'Svelte Society',
		description:
			'The Svelte Society is a community of developers who use Svelte to build web applications.',
		url: page.url.toString(),
		site_name: SEO_CONFIG.siteName,
		twitter_handle: SEO_CONFIG.twitterHandle,
		open_graph_image: SEO_CONFIG.defaultOgImage
	}

	let shortcuts = $derived(await getSidebarShortcuts())

	const links = $derived([
		{ name: 'Home', href: '/' },
		{ name: 'Saved', href: '/saved', disabled: !user },
		{ name: 'CURATED', href: null },
		{ name: 'Announcements', href: '/announcement' },
		{ name: 'Collections', href: '/collection' },
		{ name: 'CODE / RESOURCES', href: null },
		{ name: 'Libraries', href: '/library' },
		{ name: 'Resources', href: '/resource' },
		{ name: 'LEARNING', href: null },
		{ name: 'Videos', href: '/video' },
		{ name: 'Recipes', href: '/recipe' },
		...(shortcuts.length > 0
			? [{ name: 'SHORTCUTS', href: null }, ...shortcuts.map((s) => ({ ...s, isShortcut: true }))]
			: [])
	])
</script>

<svelte:head>
	<script
		defer
		src="https://umami.sveltesociety.dev/script.js"
		data-website-id="d91db9d2-f32f-4781-a861-efba1953edea"
	></script>
</svelte:head>

<Seo config={page.data.meta || fallbackMeta} />

<div class="flex min-h-screen flex-col">
	<Header user={await getUser()} announcement={await getHeaderAnnouncement()} />

	<main
		class="relative mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 gap-2 sm:grid-cols-[1.5fr_5fr_2.5fr] md:gap-4 lg:gap-6"
		style:--header-height={(await getHeaderAnnouncement()) ? '7.5rem' : '5rem'}
	>
		<LeftSidebar {links} />

		<div class="flex min-w-0 flex-col px-4 pt-8">
			<div class="mb-6 shrink-0 sm:hidden">
				<MobileMenu {links} upcomingEvents={await getUpcomingEvents()} />
			</div>

			<div class="min-w-0 flex-1 pb-8">
				{@render children()}
			</div>
		</div>

		<RightSidebar upcomingEvents={await getUpcomingEvents()} tags={await getTags()} jobs={await getSidebarJobs()} />

		{#if user?.role === 1}
			<a
				href="/admin"
				class="bg-svelte-900 hover:bg-svelte-500 focus:ring-svelte-500 fixed bottom-4 left-4 z-50 rounded-full p-3 text-white shadow-lg transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:outline-none"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
				<span class="sr-only">Admin Dashboard</span>
			</a>
		{/if}
	</main>
</div>
