<div>
	<slot />
</div>

<style>
	div {
		background-color: rgba(99, 177, 249, 0.2);
		border-left: 4px solid rgb(99, 177, 249);
		border-radius: 5px;
		margin: 1rem 0;
		padding: 0.75rem 1.5rem 1rem 1.5rem;
	}

	div :global(a) {
		color: inherit;
		border-bottom: 2px dashed rgb(99, 177, 249);
		margin: 0 -3px;
		padding: 0 3px;
	}
	div :global(a:active),
	div :global(a:focus),
	div :global(a:hover) {
		background: rgb(99, 177, 249);
		border-bottom: 2px solid black;
		color: black;
		text-decoration: none;
	}
</style>
