<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
</script>

<div class="mx-auto max-w-2xl text-center">
	<div class="mb-8">
		<svg
			class="mx-auto h-16 w-16 text-green-500"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	</div>

	<h1 class="mb-4 text-3xl font-bold text-gray-900">Thank You for Your Submission!</h1>

	<p class="mb-6 text-lg text-gray-600">
		Your content has been received and is now pending moderation. Our team will review it shortly
		and it will be published once approved.
	</p>

	<p class="mb-8 text-sm text-gray-500">
		You'll be able to see your published content in the community once it's been reviewed. Thank you
		for contributing to the Svelte Society!
	</p>

	<div class="flex flex-col justify-center gap-4 sm:flex-row">
		<Button href="/" primary>Browse Community</Button>
		<Button href="/submit">Submit Another</Button>
	</div>
</div>
