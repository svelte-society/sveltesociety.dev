<script lang="ts">
	export let src: string | null = null;
	export let name: string;
	export let size: 'sm' | 'md' | 'lg' = 'md';

	const sizeClasses = {
		sm: 'w-8 h-8 text-xs',
		md: 'w-10 h-10 text-sm',
		lg: 'w-12 h-12 text-base'
	};

	function getInitials(name: string): string {
		return name
			.split(' ')
			.map((word) => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	const initials = getInitials(name);
</script>

<div
	class={`relative ${sizeClasses[size]} flex items-center justify-center overflow-hidden rounded-full border-2 border-indigo-500 bg-gray-200`}
>
	{#if src}
		<img {src} alt={name} class="h-full w-full object-cover" />
	{:else}
		<span class="font-medium text-gray-600">{initials}</span>
	{/if}
</div>
