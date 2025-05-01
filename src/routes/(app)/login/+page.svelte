<!-- Login page -->
<script lang="ts">
	let { data } = $props()
</script>

<div class="flex min-h-[30vh] flex-col items-center justify-center px-4">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<h1 class="text-svelte-900 text-3xl font-bold">Sign up or Login</h1>
			<p class="mt-2 text-sm text-slate-600">Sign in using one of the following providers</p>
		</div>

		<div class="mt-8 space-y-4">
			{#each data.authProviders as provider}
				<a
					data-sveltekit-preload-data="false"
					href={`/auth/${provider.name.toLowerCase()}`}
					class="focus:ring-svelte-300 flex w-full items-center justify-center space-x-3 rounded-md px-4 py-3 text-sm font-medium transition-colors hover:underline focus:ring-2 focus:outline-none {provider.color}"
				>
					<span class="h-5 w-5">
						{#if provider.icon === 'google'}
							<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
								><path
									d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.36 14.8c-1.44 2.41-4.2 3.73-7.12 3.2-2.92-.53-5.13-2.95-5.4-5.88-.36-3.39 1.69-6.62 4.85-7.71.28-.1.57.13.57.42 0 .21-.13.39-.33.46-2.49 1-4.04 3.59-3.55 6.34.48 2.77 2.94 4.85 5.75 4.83 2.96-.02 5.4-2.48 5.44-5.45 0-.23.18-.43.41-.46.23-.02.44.12.51.34.58 2.02-.19 4.16-1.13 5.31z"
									fill="currentColor"
								/></svg
							>
						{:else if provider.icon === 'github'}
							<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
								><path
									d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
									fill="currentColor"
								/></svg
							>
						{:else if provider.icon === 'twitter'}
							<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
								><path
									d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"
									fill="currentColor"
								/></svg
							>
						{/if}
					</span>
					<span>Continue with {provider.name}</span>
				</a>
			{/each}
		</div>

		<div class="mt-6 text-center text-sm">
			<p class="text-slate-600">
				By signing in, you agree to our
				<a href="/terms" class="text-svelte-900 hover:text-svelte-500 font-medium"
					>Terms of Service</a
				>
				and
				<a href="/privacy" class="text-svelte-900 hover:text-svelte-500 font-medium"
					>Privacy Policy</a
				>
			</p>
		</div>

		<div class="mt-6 text-center">
			<a href="/" class="text-svelte-900 hover:text-svelte-500 text-sm font-medium">
				Back to Home
			</a>
		</div>
	</div>
</div>
