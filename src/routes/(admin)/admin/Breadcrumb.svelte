<script lang="ts">
import { page } from '$app/stores'

$page.url.searchParams

$: isAdminPage = $page.url.pathname.startsWith('/admin')
$: basePath = isAdminPage ? '/admin' : ''
$: pathParts = $page.url.pathname.replace(basePath, '').split('/').filter(Boolean)
$: breadcrumbs = pathParts.map((part, index) => ({
	name: part.charAt(0).toUpperCase() + part.slice(1),
	href: basePath + '/' + pathParts.slice(0, index + 1).join('/')
}))

$: if ($page.data.content?.title && breadcrumbs.length > 0) {
	breadcrumbs[breadcrumbs.length - 1].name = $page.data.content.title
}

$: isHomePage = $page.url.pathname === '/' || $page.url.pathname === '/admin'
</script>

{#if !isHomePage}
	<nav class="py-4 text-sm">
		<ol class="flex list-none p-0">
			<li class="flex items-center">
				<a href={basePath || '/'} class="text-gray-600 hover:text-gray-900 hover:underline">
					{isAdminPage ? 'Admin' : 'Home'}
				</a>
			</li>
			{#each breadcrumbs as crumb, index}
				<li class="flex items-center">
					{#if index > 0 || !isHomePage}
						<svg class="mx-2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					{/if}
					<a href={crumb.href} class="text-gray-600 hover:text-gray-900 hover:underline">
						{crumb.name}
					</a>
				</li>
			{/each}
		</ol>
	</nav>
{/if}
