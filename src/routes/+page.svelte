<script lang="ts">
	import Link from '$components/layout/Link.svelte';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title="Home"
	description="Svelte Society is a community-driven effort to organise and promote SvelteJS."
/>

<article class="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 xl:gap-10">
	<h1 class="m-0 text-center">Welcome to Svelte Society!</h1>
	<section>
		<p>
			We are a volunteer global network of Svelte fans that strive to promote Svelte and its
			ecosystem. As a service to the community, this site is a central index of <a href="/events"
				>events</a
			>, a <a href="/packages">packages directory</a>, as well as <a href="/recipes">recipes</a>
			and other useful resources. Join us or help us out!
		</p>
		<p>
			If you want to reach out to us or find like-minded people from around the world you can check
			out the resources below:
		</p>
	</section>
	<ul class="flex flex-wrap justify-around text-center">
		<Link path="https://discord.gg/svelte">
			<img src="images/discord.svg" alt="" />
			Discord
		</Link>
		<Link path="https://youtube.com/SvelteSociety">
			<img src="images/youtube.svg" alt="" />
			YouTube
		</Link>
		<Link path="https://twitter.com/sveltesociety">
			<img src="images/twitter.svg" alt="" />
			Twitter
		</Link>
	</ul>
	<ul class="flex flex-wrap justify-around text-center">
		<Link path="https://svelte.substack.com/">
			<img src="images/newsletter.svg" alt="" />
			Newsletter
		</Link>
		<Link path="https://www.reddit.com/r/sveltejs/">
			<img src="images/reddit.svg" alt="" />
			Reddit
		</Link>
		<Link path="https://www.svelteradio.com/">
			<img src="images/radio.svg" alt="" />
			Podcast
		</Link>
	</ul>
	<p class="text-center">
		We also run the <a href="https://sveltesummit.com/">Svelte Summit</a> conference.
	</p>
</article>

<style>
	section {
		display: grid;
		gap: var(--s-5);
	}
	ul {
		column-gap: var(--s-20);
		row-gap: var(--s-5);
	}
	img {
		width: 128px;
	}
</style>
