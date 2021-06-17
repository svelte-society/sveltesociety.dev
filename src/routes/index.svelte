<script>
	import Link from './_SocialLinks/Link.svelte';
	import { page } from '$app/stores';
	import metatags from '$lib/stores/metatags';
	import metatagImage from './metatag.png';

	metatags.title('Svelte Society - a community for Svelte users around the world.');
	metatags.desc('Svelte Society is a community-driven effort to organise and promote SvelteJS.');
	metatags.image(metatagImage);
	metatags.url($page.host + $page.path);
</script>

<div class="wrapper">
	<h1>Welcome to Svelte Society!</h1>
	<p>
		We are a volunteer global network of Svelte fans that strive to promote Svelte and its ecosystem.
		As a service to the community, this site is a central index of <a href="/events">events</a>,
		a <a href="/components">components directory</a>, as well as <a href="/receipes">recipes</a> and other useful resources.
		Join us or help us out!
	</p>
	<p>
		If you want to reach out to us or find like-minded people from around the world you
		can check out the resources below:
	</p>
	<ul>
		<Link path="https://youtube.com/SvelteSociety" image="images/youtube.svg" alt="YouTube icon"
			>YouTube Channel</Link
		>
		<Link path="https://discord.gg/svelte" image="images/discord.svg" alt="Discord icon"
			>Discord</Link
		>
		<Link path="https://twitter.com/sveltesociety" image="images/twitter.svg" alt="Twitter icon"
			>Twitter</Link
		>
	</ul>
	<p>
		We also run the biannual <a href="https://sveltesummit.com/">Svelte Summit</a> conference 
		and host <a href="https://www.svelteradio.com/">the Svelte Radio podcast</a>.
	</p>
</div>

<style>
	h1 {
		text-align: center;
		margin-bottom: var(--space-300);
	}
	p {
		margin: 0 auto;
		line-height: 1.6;
		max-width: 60ch;
		margin-bottom: var(--space-300);
	}
	ul {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		grid-gap: var(--space-600);
		list-style-type: none;
		margin: calc(var(--space-600) * 3) 0;
	}
</style>
