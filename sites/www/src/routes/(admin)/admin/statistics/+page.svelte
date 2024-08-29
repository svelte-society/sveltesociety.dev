<script>
	import { PUBLIC_PLAUSIBLE_SHARED_LINK_AUTH } from '$env/static/public';

	let PLAUSIBLE_HTML =
		'<script' +
		`async src="https://analytics.sveltesociety.dev/js/embed.host.js">` +
		`

    <iframe
	title="Svelte Society Analytics"
	src="https://analytics.sveltesociety.dev/share/sveltesociety.dev?auth=${PUBLIC_PLAUSIBLE_SHARED_LINK_AUTH}&embed=true&theme=light"
	scrolling="no"
	frameborder="0"
	loading="lazy"
	style="width: 1px; min-width: 100%; height: 1600px;"
    ></iframe>`;
</script>

{@html PLAUSIBLE_HTML}
