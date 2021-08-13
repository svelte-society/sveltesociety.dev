<script>
	export let path, image, alt;
</script>

<li class="flex-0 lg:flex-auto flex flex-wrap justify-center font-bold">
	<a href={path} class="no-underline text-current text-center"><img src={image} {alt} /><slot /></a>
</li>

<style>
	img {
		width: 128px;
	}
</style>
