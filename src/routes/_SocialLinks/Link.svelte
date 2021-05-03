<script>
	export let path, image, alt;
</script>

<li>
	<a href={path}><img src={image} {alt} /><slot /></a>
</li>

<style>
	li {
		display: grid;
		place-items: center;
		font-weight: 900;
	}
	img {
		width: 128px;
	}
	a {
		text-decoration: none;
		color: black;
		display: grid;
		place-items: center;
	}
</style>
