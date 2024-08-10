<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/ui/Button.svelte';
	import { formatRelativeDate } from '$lib/utils/date';
	let { data } = $props();
	function formatJSON(obj: any): string {
		return JSON.stringify(obj, null, 2);
	}
	function getStatusColor(status: string): string {
		switch (status.toLowerCase()) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'approved':
				return 'bg-green-100 text-green-800';
			case 'rejected':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
	function getRoleColor(role: string): string {
		switch (role.toLowerCase()) {
			case 'admin':
				return 'bg-purple-100 text-purple-800';
			case 'editor':
				return 'bg-blue-100 text-blue-800';
			case 'user':
				return 'bg-gray-100 text-gray-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="container mx-auto px-2 py-4">
	<div class="mb-4 grid grid-cols-[1fr_auto] content-start gap-2">
		<h1 class="text-xl font-bold">Moderation Item: {data.item.id}</h1>
		<Button small secondary href="/admin/moderation" icon_left="arrow-left">Back to Queue</Button>
	</div>
	<div class="mb-4 grid gap-4 md:grid-cols-2">
		<div class="overflow-hidden rounded-lg bg-white shadow-sm">
			<div class="px-4 py-5 sm:p-6">
				<h2 class="mb-4 text-lg font-semibold">Item Details</h2>
				<div class="space-y-3 text-sm">
					<p><span class="font-medium">Type:</span> {data.item.type}</p>
					<p>
						<span class="font-medium">Status:</span>
						<span
							class={`ml-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
								data.item.status
							)}`}
						>
							{data.item.status}
						</span>
					</p>
					<p>
						<span class="font-medium">Submitted:</span>
						{formatRelativeDate(data.item.submitted_at)}
					</p>
				</div>
			</div>
		</div>
		<div class="overflow-hidden rounded-lg bg-white shadow-sm">
			<div class="px-4 py-5 sm:p-6">
				<h2 class="mb-4 text-lg font-semibold">Submitter</h2>
				<div class="mb-4 flex items-center">
					{#if data.submitter.avatar_url}
						<img
							src={data.submitter.avatar_url}
							alt={data.submitter.name}
							class="mr-4 h-10 w-10 rounded-full"
						/>
					{:else}
						<div class="mr-4 h-10 w-10 rounded-full bg-gray-200"></div>
					{/if}
					<div class="space-y-1">
						<p class="font-medium">{data.submitter.name}</p>
						<p class="flex items-center text-xs text-gray-500">
							<svg
								class="mr-1 h-4 w-4 fill-current text-blue-400"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<title>Twitter</title>
								<path
									d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
								/>
							</svg>
							<a
								href={`https://twitter.com/${data.submitter.twitter}`}
								target="_blank"
								rel="noopener noreferrer"
								class="hover:underline"
							>
								@{data.submitter.twitter}
							</a>
						</p>
						<p class="flex items-center text-xs text-gray-500">
							<svg
								class="mr-1 h-4 w-4 fill-current text-gray-700"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<title>GitHub</title>
								<path
									d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
								/>
							</svg>
							<a
								href={`https://github.com/${data.submitter.username}`}
								target="_blank"
								rel="noopener noreferrer"
								class="hover:underline"
							>
								@{data.submitter.username}
							</a>
						</p>
					</div>
				</div>
				<div class="space-y-2 text-sm">
					<p><span class="font-medium">Email:</span> {data.submitter.email}</p>
					<p>
						<span class="font-medium">Role:</span>
						<span
							class={`ml-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${getRoleColor(
								data.submitter.role || 'Unknown'
							)}`}
						>
							{data.submitter.role}
						</span>
					</p>
				</div>
			</div>
		</div>
	</div>
	<div class="mb-4 overflow-hidden rounded-lg bg-white shadow-sm">
		<div class="px-4 py-5 sm:p-6">
			<h2 class="mb-4 text-lg font-semibold">Submission Data</h2>
			<pre class="max-h-96 overflow-x-auto overflow-y-auto rounded bg-gray-50 p-4 text-xs">
				{formatJSON(JSON.parse(data.item.data))}
			</pre>
		</div>
	</div>
	<div class="flex justify-end space-x-4">
		<form method="POST" action="?/reject" use:enhance>
			<Button type="submit" small error icon_left="x-circle">Reject</Button>
		</form>
		<form method="POST" action="?/approve" use:enhance>
			<Button type="submit" small success icon_left="check-circle">Approve</Button>
		</form>
	</div>
</div>
