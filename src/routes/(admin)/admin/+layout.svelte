<script lang="ts">
	import type { Link } from './MobileAdminMenu.svelte'
	import { Toaster } from 'svelte-sonner'
	import Breadcrumb from './Breadcrumb.svelte'
	import Sidebar from './Sidebar.svelte'
	import MobileAdminMenu from './MobileAdminMenu.svelte'
	let { data, children } = $props()

	const allLinks: Link[] = [
		{
			href: '/admin',
			label: 'Dashboard',
			icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
			allowedRoles: ['admin', 'moderator', 'editor']
		},
		{
			href: '/admin/users',
			label: 'Users',
			icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
			allowedRoles: ['admin']
		},
		{
			href: '/admin/roles',
			label: 'Roles',
			icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
			allowedRoles: ['admin']
		},
		{
			href: '/admin/content',
			label: 'Content',
			icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
			allowedRoles: ['admin', 'moderator', 'editor']
		},
		{
			href: '/admin/tags',
			label: 'Tags',
			icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
			allowedRoles: ['admin', 'moderator']
		},
		{
			href: '/admin/announcements',
			label: 'Announcements',
			icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
			allowedRoles: ['admin', 'moderator']
		},
		{
			href: '/admin/external-content',
			label: 'External Content',
			icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
			allowedRoles: ['admin', 'moderator']
		},
		{
			href: '/admin/bulk-import',
			label: 'Bulk Import',
			icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
			allowedRoles: ['admin', 'moderator']
		},
		{
			href: '/admin/moderation',
			label: 'Moderation',
			icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
			allowedRoles: ['admin', 'moderator']
		},
		{
			href: '/admin/social',
			label: 'Social Media',
			icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z',
			allowedRoles: ['admin', 'moderator']
		}
	]

	// Filter links based on user role
	const links = $derived(
		data.userRole ? allLinks.filter((link) => link.allowedRoles.includes(data.userRole!)) : []
	)
</script>

<div class="flex h-screen bg-gray-100">
	<Sidebar {links} moderationCount={data.moderation_count} />
	<div class="flex-1 overflow-y-auto">
		<div class="mx-auto max-w-6xl p-4 md:p-8">
			<div class="mb-6 md:hidden">
				<MobileAdminMenu {links} moderationCount={data.moderation_count} />
			</div>

			<Breadcrumb />
			{@render children()}
		</div>
	</div>
</div>

<Toaster richColors />
