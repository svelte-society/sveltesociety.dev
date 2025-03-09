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

<main class="flex-1 px-4 py-8">
	<h1 class="mb-6 text-2xl font-bold">My Account</h1>
	
	{#if user}
	<div class="grid gap-2 rounded-lg bg-zinc-50 p-5">
		<div class="px-4 py-5 sm:p-6">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-2xl font-bold text-gray-900">Profile</h2>
				<Button primary href="/account/edit">Edit Profile</Button>
			</div>

			<div class="mb-8 flex flex-col items-center sm:flex-row sm:space-x-6">
				<div class="mb-4 h-24 w-24 overflow-hidden rounded-full bg-gray-200 sm:mb-0">
					<img src={user.avatar_url || '/default-avatar.png'} alt="User avatar" class="h-full w-full object-cover" />
				</div>
				<div class="text-center sm:text-left">
					<h3 class="text-xl font-semibold text-gray-900">
						{user.name || user.username}
					</h3>
					<p class="text-sm text-gray-500">@{user.username}</p>
					<p class="mt-2 text-sm text-gray-600">{user.bio || 'No bio provided'}</p>
				</div>
			</div>

			<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div class="rounded-lg bg-gray-50 p-4">
					<dt class="text-sm font-medium text-gray-500">Location</dt>
					<dd class="mt-1 text-lg font-semibold text-gray-900">
						{user.location || 'Not specified'}
					</dd>
				</div>

				<div class="rounded-lg bg-gray-50 p-4">
					<dt class="text-sm font-medium text-gray-500">Twitter</dt>
					<dd class="mt-1 text-lg font-semibold text-gray-900">
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

				<div class="rounded-lg bg-gray-50 p-4">
					<dt class="text-sm font-medium text-gray-500">Member Since</dt>
					<dd class="mt-1 text-lg font-semibold text-gray-900">
						{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
					</dd>
				</div>
			</div>

			<div class="mb-8">
				<h3 class="mb-4 text-xl font-semibold text-gray-900">Activity</h3>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="rounded-lg bg-gray-50 p-4">
						<div class="flex items-center justify-between">
							<dt class="text-sm font-medium text-gray-500">Content Created</dt>
							<dd class="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
								Author
							</dd>
						</div>
						<div class="mt-2">
							<div class="flex items-baseline justify-between">
								<dd class="mt-1 text-3xl font-semibold text-gray-900">
									{user.authoredContents?.length || 0}
								</dd>
								<div class="text-sm text-gray-500">out of 100</div>
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

					<div class="rounded-lg bg-gray-50 p-4">
						<div class="flex items-center justify-between">
							<dt class="text-sm font-medium text-gray-500">Collections Created</dt>
							<dd class="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
								Curator
							</dd>
						</div>
						<div class="mt-2">
							<div class="flex items-baseline justify-between">
								<dd class="mt-1 text-3xl font-semibold text-gray-900">
									{user.authoredCollections?.length || 0}
								</dd>
								<div class="text-sm text-gray-500">out of 20</div>
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

	<div class="mt-8">
		<h2 class="mb-6 text-2xl font-bold">My Content</h2>
		<div class="space-y-6">
			{#each user.authoredContents || [] as post}
				<article class="grid gap-2 rounded-lg bg-zinc-50 p-5">
					<div class="mb-2 grid grid-cols-[1fr_auto] items-start justify-between text-xs">
						<div class="flex">
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

					<h2 class="mb-2 text-xl font-bold">
						<a href="/{post.type}/{post.slug}">{post.title}</a>
					</h2>
					<p>{post.description}</p>
				</article>
			{/each}
		</div>
	</div>
	{:else}
	<div class="rounded-lg bg-zinc-50 p-8 text-center">
		<h2 class="mb-4 text-xl font-semibold">Please log in to view your account</h2>
		<Button primary href="/login">Log In</Button>
	</div>
	{/if}
</main>
