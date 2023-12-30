<div class="list">
	<div class="grid">
		<slot />
	</div>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 25px;
	}
	.list {
		margin-bottom: 5rem;
	}
	@media screen and (max-width: 1024px) {
		.grid {
			max-width: calc(var(--width-card) * 2 + 25px);
			grid-template-columns: repeat(2, 1fr);
			margin: 0 auto;
		}
	}
	@media screen and (max-width: 700px) {
		.grid {
			max-width: var(--width-card);
			grid-template-columns: 1fr;
			margin: 0 auto;
		}
	}
</style>
