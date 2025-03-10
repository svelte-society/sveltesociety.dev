<script lang="ts">
import Button from '$lib/ui/Button.svelte'

// Define a more complete User interface
interface ExtendedUser {
	id: string;
	username: string;
	name?: string;
	bio?: string;
	avatar_url?: string;
	location?: string;
	twitter?: string;
	created_at?: string;
	authoredContents?: any[];
	authoredCollections?: any[];
}

let { data } = $props()

// Ensure user data has the expected shape
const user = data.user as ExtendedUser | null;
</script>

<main class="flex-1 py-4 sm:px-4 sm:py-8">
	<h1 class="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold">My Account</h1>
	
	{#if user}
	<div class="grid gap-2 rounded-lg bg-zinc-50 p-3 sm:p-5">
		<div class="px-2 py-3 sm:px-4 sm:py-5 md:p-6">
			<div class="mb-4 sm:mb-6 flex items-center justify-between gap-3">
				<h2 class="text-xl sm:text-2xl font-bold text-gray-900">Profile</h2>
				<div class="flex gap-2 sm:gap-3">
					<!-- Edit Profile Button - Icon on mobile, full button on larger screens -->
					<a 
						href="/account/edit" 
						class="sm:hidden inline-flex items-center justify-center p-2 rounded-md bg-svelte-900 text-white hover:brightness-150 transition-colors"
						aria-label="Edit Profile"
					>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
						</svg>
					</a>
					<div class="hidden sm:block">
						<Button small primary href="/account/edit">Edit Profile</Button>
					</div>
					
					<!-- Logout Button - Icon on mobile, full button on larger screens -->
					<form action="/auth/logout" method="POST" class="sm:hidden">
						<button 
							type="submit" 
							class="inline-flex items-center justify-center p-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
							aria-label="Logout"
						>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
							</svg>
						</button>
					</form>
					<form action="/auth/logout" method="POST" class="hidden sm:block">
						<Button secondary small type="submit">Logout</Button>
					</form>
				</div>
			</div>

			<div class="mb-6 sm:mb-8 flex flex-col items-center sm:flex-row sm:space-x-6">
				<div class="mb-4 h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-full bg-gray-200 sm:mb-0">
					<img src={user.avatar_url || '/default-avatar.png'} alt="User avatar" class="h-full w-full object-cover" />
				</div>
				<div class="text-center sm:text-left">
					<h3 class="text-lg sm:text-xl font-semibold text-gray-900">
						{user.name || user.username}
					</h3>
					<p class="text-sm text-gray-500">@{user.username}</p>
					<p class="mt-2 text-sm text-gray-600">{user.bio || 'No bio provided'}</p>
				</div>
			</div>

			<div class="mb-6 sm:mb-8 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div class="rounded-lg bg-gray-50 p-3 sm:p-4">
					<dt class="text-xs sm:text-sm font-medium text-gray-500">Location</dt>
					<dd class="mt-1 text-base sm:text-lg font-semibold text-gray-900">
						{user.location || 'Not specified'}
					</dd>
				</div>

				<div class="rounded-lg bg-gray-50 p-3 sm:p-4">
					<dt class="text-xs sm:text-sm font-medium text-gray-500">Twitter</dt>
					<dd class="mt-1 text-base sm:text-lg font-semibold text-gray-900 break-words">
						{#if user.twitter}
							<a
								href="https://twitter.com/{user.twitter}"
								target="_blank"
								rel="noopener noreferrer"
								class="text-blue-600 hover:text-blue-800"
							>
								@{user.twitter}
							</a>
						{:else}
							Not specified
						{/if}
					</dd>
				</div>

				<div class="rounded-lg bg-gray-50 p-3 sm:p-4">
					<dt class="text-xs sm:text-sm font-medium text-gray-500">Member Since</dt>
					<dd class="mt-1 text-base sm:text-lg font-semibold text-gray-900">
						{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
					</dd>
				</div>
			</div>

			<div class="mb-6 sm:mb-8">
				<h3 class="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-gray-900">Activity</h3>
				<div class="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
					<div class="rounded-lg bg-gray-50 p-3 sm:p-4">
						<div class="flex items-center justify-between">
							<dt class="text-xs sm:text-sm font-medium text-gray-500">Content Created</dt>
							<dd class="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
								Author
							</dd>
						</div>
						<div class="mt-2">
							<div class="flex items-baseline justify-between">
								<dd class="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">
									{user.authoredContents?.length || 0}
								</dd>
								<div class="text-xs sm:text-sm text-gray-500">out of 100</div>
							</div>
							<div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
								<div
									class="h-full rounded-full bg-blue-600"
									style="width: {Math.min(
										((user.authoredContents?.length || 0) / 100) * 100,
										100
									)}%"
								></div>
							</div>
						</div>
					</div>

					<div class="rounded-lg bg-gray-50 p-3 sm:p-4">
						<div class="flex items-center justify-between">
							<dt class="text-xs sm:text-sm font-medium text-gray-500">Collections Created</dt>
							<dd class="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
								Curator
							</dd>
						</div>
						<div class="mt-2">
							<div class="flex items-baseline justify-between">
								<dd class="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">
									{user.authoredCollections?.length || 0}
								</dd>
								<div class="text-xs sm:text-sm text-gray-500">out of 20</div>
							</div>
							<div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
								<div
									class="h-full rounded-full bg-purple-600"
									style="width: {Math.min(
										((user.authoredCollections?.length || 0) / 20) * 100,
										100
									)}%"
								></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-6 sm:mt-8">
		<h2 class="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold">My Content</h2>
		<div class="space-y-4 sm:space-y-6">
			{#each user.authoredContents || [] as post}
				<article class="grid gap-2 rounded-lg bg-zinc-50 p-3 sm:p-5">
					<div class="mb-2 grid grid-cols-[1fr_auto] items-start justify-between text-xs">
						<div class="flex flex-wrap">
							<span class="font-semibold capitalize">{post.type}&nbsp;</span>
							<span class="flex text-gray-500"
								><span
									>by {user.name || user.username} • {new Date(
										post.created_at
									).toLocaleDateString()}</span
								>
							</span>
						</div>
					</div>

					<h2 class="mb-2 text-lg sm:text-xl font-bold">
						<a href="/{post.type}/{post.slug}" class="hover:text-svelte-900 transition-colors">{post.title}</a>
					</h2>
					<p class="text-sm sm:text-base">{post.description}</p>
				</article>
			{:else}
				<div class="rounded-lg bg-zinc-50 p-4 text-center">
					<p class="text-gray-600">You haven't created any content yet.</p>
				</div>
			{/each}
		</div>
	</div>
	{:else}
	<div class="rounded-lg bg-zinc-50 p-6 sm:p-8 text-center">
		<h2 class="mb-4 text-lg sm:text-xl font-semibold">Please log in to view your account</h2>
		<!-- Login button - full button on all screen sizes -->
		<Button primary href="/login">Log In</Button>
	</div>
	{/if}
</main>
