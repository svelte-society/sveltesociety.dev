<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ item, submitter } = data);

	function formatJSON(obj: any): string {
		return JSON.stringify(obj, null, 2);
	}

	function getStatusColor(status: string): string {
		switch (status.toLowerCase()) {
			case 'pending':
				return 'bg-yellow-200 text-yellow-800';
			case 'approved':
				return 'bg-green-200 text-green-800';
			case 'rejected':
				return 'bg-red-200 text-red-800';
			default:
				return 'bg-gray-200 text-gray-800';
		}
	}

	function getRoleColor(role: string): string {
		switch (role.toLowerCase()) {
			case 'admin':
				return 'bg-purple-200 text-purple-800';
			case 'moderator':
				return 'bg-blue-200 text-blue-800';
			case 'user':
				return 'bg-gray-200 text-gray-800';
			default:
				return 'bg-gray-200 text-gray-800';
		}
	}
</script>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<h1 class="mb-6 text-3xl font-bold">Moderation Item: {item.id}</h1>
	<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
		<div class="rounded-lg bg-white p-6 shadow-md">
			<h2 class="mb-4 text-xl font-semibold">Item Details</h2>
			<div class="space-y-3">
				<p><strong>Type:</strong> {item.type}</p>
				<p>
					<strong>Status:</strong>
					<span
						class={`ml-2 inline-block rounded-full px-2 py-1 text-sm font-semibold ${getStatusColor(item.status)}`}
					>
						{item.status}
					</span>
				</p>
				<p><strong>Submitted:</strong> {new Date(item.submitted_at).toLocaleString()}</p>
			</div>
		</div>
		<div class="rounded-lg bg-white p-6 shadow-md">
			<h2 class="mb-4 text-xl font-semibold">Submitter</h2>
			<div class="mb-4 flex items-center">
				{#if submitter.avatar_url}
					<img
						src={submitter.avatar_url}
						alt={submitter.name}
						class="mr-4 h-12 w-12 rounded-full"
					/>
				{:else}
					<div class="mr-4 h-12 w-12 rounded-full bg-gray-200"></div>
				{/if}
				<div>
					<p class="font-medium">{submitter.name}</p>
					<p class="text-sm text-gray-600">@{submitter.username}</p>
				</div>
			</div>
			<div class="space-y-2">
				<p><strong>Email:</strong> {submitter.email}</p>
				<p>
					<strong>Role:</strong>
					<span
						class={`ml-2 inline-block rounded-full px-2 py-1 text-sm font-semibold ${getRoleColor(submitter.role)}`}
					>
						{submitter.role}
					</span>
				</p>
			</div>
		</div>
	</div>
	<div class="mb-6 rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-4 text-xl font-semibold">Submission Data</h2>
		<pre class="overflow-x-auto rounded bg-gray-100 p-4 text-sm">
      {formatJSON(JSON.parse(item.data))}
    </pre>
	</div>
	<div class="mb-6 flex items-center justify-between">
		<a href="/admin/moderation" class="text-blue-500 hover:text-blue-600"> &larr; Back to Queue </a>
		<div class="flex space-x-4">
			<form method="POST" action="?/reject" use:enhance>
				<button class="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600">
					Reject
				</button>
			</form>
			<form method="POST" action="?/approve" use:enhance>
				<button class="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600">
					Approve
				</button>
			</form>
		</div>
	</div>
</div>
