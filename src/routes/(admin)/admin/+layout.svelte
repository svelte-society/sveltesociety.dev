<script lang="ts">
	import type { Icon } from 'phosphor-svelte'
	import { Toaster } from 'svelte-sonner'
	import Breadcrumb from './Breadcrumb.svelte'
	import Sidebar from './Sidebar.svelte'
	import MobileAdminMenu from './MobileAdminMenu.svelte'
	import {
		House,
		Users,
		FileText,
		Tag,
		Megaphone,
		LinkSimple,
		ArrowsLeftRight,
		CloudArrowUp
	} from 'phosphor-svelte'

	let { data, children } = $props()

	export type NavLink = {
		href: string
		label: string
		icon: typeof Icon
		allowedRoles: string[]
		badge?: number
	}

	const allLinks: NavLink[] = [
		{
			href: '/admin',
			label: 'Dashboard',
			icon: House,
			allowedRoles: ['admin', 'moderator', 'editor']
		},
		{
			href: '/admin/users',
			label: 'Users',
			icon: Users,
			allowedRoles: ['admin']
		},
		{
			href: '/admin/content',
			label: 'Content',
			icon: FileText,
			allowedRoles: ['admin', 'moderator', 'editor'],
			badge: data.pendingReviewCount
		},
		{
			href: '/admin/tags',
			label: 'Tags',
			icon: Tag,
			allowedRoles: ['admin', 'moderator']
		},
		{
			href: '/admin/announcements',
			label: 'Announcements',
			icon: Megaphone,
			allowedRoles: ['admin', 'moderator']
		},
		{
			href: '/admin/shortcuts',
			label: 'Shortcuts',
			icon: LinkSimple,
			allowedRoles: ['admin', 'moderator']
		},
		{
			href: '/admin/external-content',
			label: 'External Content',
			icon: ArrowsLeftRight,
			allowedRoles: ['admin', 'moderator']
		},
		{
			href: '/admin/bulk-import',
			label: 'Bulk Import',
			icon: CloudArrowUp,
			allowedRoles: ['admin', 'moderator']
		}
	]

	// Filter links based on user role
	const links = $derived(
		data.userRole ? allLinks.filter((link) => link.allowedRoles.includes(data.userRole!)) : []
	)
</script>

<div
	data-sveltekit-preload-data="false"
	class="flex h-screen bg-linear-to-br from-gray-50 to-gray-100"
>
	<Sidebar {links} />
	<div class="flex-1 overflow-y-auto">
		<div class="mx-auto max-w-7xl p-4 md:p-8">
			<div class="mb-6 md:hidden">
				<MobileAdminMenu {links} />
			</div>

			<Breadcrumb />
			{@render children()}
		</div>
	</div>
</div>

<Toaster richColors />
