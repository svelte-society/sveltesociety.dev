<script>
	import Link from './_SocialLinks/Link.svelte';
	import { page } from '$app/stores';
	import metatags from '$lib/stores/metatags';

	metatags.title('Svelte Society - a community for Svelte users around the world.');
	metatags.desc('Svelte Society is a community-driven effort to organise and promote SvelteJS.');
	metatags.url($page.host + $page.path);
</script>

<svelte:head>
	<title>Home - Svelte Society</title>
</svelte:head>

<section class="py-10 px-5 max-w-5xl mx-auto text-200 grid grid-cols-1 gap-10 lg:gap-20">
	<h1 class="text-center">Welcome to Svelte Society!</h1>
	<section class="grid gap-5">
		<p>
			We are a volunteer global network of Svelte fans that strive to promote Svelte and its
			ecosystem. As a service to the community, this site is a central index of <a href="/events"
				>events</a
			>, a <a href="/components">components directory</a>, as well as <a href="/recipes">recipes</a>
			and other useful resources. Join us or help us out!
		</p>
		<p>
			If you want to reach out to us or find like-minded people from around the world you can check
			out the resources below:
		</p>
	</section>
	<ul class="flex flex-wrap gap-x-20 gap-y-6 justify-center">
		<Link path="https://youtube.com/SvelteSociety" image="images/youtube.svg" alt="YouTube icon"
			>YouTube</Link
		>
		<Link path="https://discord.gg/svelte" image="images/discord.svg" alt="Discord icon"
			>Discord</Link
		>
		<Link path="https://twitter.com/sveltesociety" image="images/twitter.svg" alt="Twitter icon"
			>Twitter</Link
		>
		<Link path="https://svelte.substack.com/" image="images/newsletter.svg" alt="Newsletter icon"
			>Newsletter</Link
		>
		<Link path="https://www.svelteradio.com/" image="images/radio.svg" alt="Radio icon"
			>Podcast</Link
		>
	</ul>
	<p>
		We also run the <a href="https://sveltesummit.com/">Svelte Summit</a> conference and host
		<a href="https://www.svelteradio.com/">the Svelte Radio podcast</a>.
	</p>
</section>
