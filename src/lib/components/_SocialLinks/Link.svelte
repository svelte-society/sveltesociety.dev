<script>
	export let path, image, alt;
</script>

<li class="flex-0 lg:flex-auto flex flex-wrap justify-center font-bold">
	<a
		href={path}
		class="text-basics-900 text-lg no-underline uppercase text-center border-b-4 border-transparent hover:border-b-primary focus:border-b-primary"
		><img src={image} {alt} /><slot /></a
	>
</li>

<style>
	img {
		width: 128px;
	}
	a {
		font-size: var(--font-100);
		transition: border-bottom 0.2s;
		letter-spacing: 0.05rem;
		font-weight: lighter;
	}
</style>
