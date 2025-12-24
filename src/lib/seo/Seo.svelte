<script lang="ts">
	/**
	 * Enhanced SEO Component
	 *
	 * Wraps svead's Head component and adds extra meta tags:
	 * - Canonical link
	 * - og:type
	 * - Robots directive
	 */
	import { Head } from 'svead'
	import type { SeoMetaTagConfig } from './types'

	interface Props {
		config: SeoMetaTagConfig
	}

	let { config }: Props = $props()

	// Default robots directive for public pages
	const robots = $derived(config.robots ?? 'index, follow')

	// Default og:type to website if not specified
	const ogType = $derived(config.og_type ?? 'website')
</script>

<svelte:head>
	<!-- Canonical URL -->
	<link rel="canonical" href={config.url} />

	<!-- Open Graph type (not provided by svead) -->
	<meta property="og:type" content={ogType} />

	<!-- Robots directive -->
	<meta name="robots" content={robots} />
</svelte:head>

<!-- Svead handles the rest: title, description, og:title, og:description, og:image, etc. -->
<Head seo_config={config} />
