<script lang="ts">
	import licenses from './licenses.json';

	const names = Object.values(licenses)
		.flat()
		.map((item) => item.name)
		.filter(Boolean);
</script>

<p>
	This website uses the following packages (directly or indirectly):
	<select multiple>
		{#each names as name}<option>{name}</option>{/each}
	</select>
</p>
<p>You can find their license here:</p>

{#each Object.entries(licenses ?? {}) as license}
	<details>
		<summary>{license[0]}</summary>
		{#each license[1] as item}
			<details>
				<summary>{item.name}</summary>
				<dl>
					{#each Object.entries(item).filter(([key]) => !['path', 'name', 'license'].includes(key)) as [name, value]}
						<dt>{name}</dt>
						<dd>{value}</dd>
					{/each}
				</dl>
			</details>
		{/each}
	</details>
{/each}

<p>
	You can find licenses text here: <a href="https://choosealicense.com/appendix/" target="_blank"
		>Appendix | Choose a License</a
	>
</p>

<style>
	p select {
		vertical-align: top;
	}

	details {
		padding-inline: 1em;
	}

	details summary {
		font-size: 1.2em;
	}

	details details summary {
		font-family: monospace;
	}

	details[open] {
		padding-bottom: 1em;
	}

	dl {
		padding-left: 1em;
	}

	dl dt {
		font-weight: bold;
		text-transform: uppercase;
		font-size: 0.8em;
		opacity: 1;
	}

	dl dt + dd {
		padding-left: 1em;
	}
</style>
