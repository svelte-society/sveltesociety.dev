<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/ui/Button.svelte';
	import { formatRelativeDate } from '$lib/utils/date';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ item, submitter } = data);

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
			case 'moderator':
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
		<h1 class="text-xl font-bold">Moderation Item: {item.id}</h1>
		<Button small secondary href="/admin/moderation" icon_left="arrow-left">Back to Queue</Button>
	</div>

	<div class="mb-4 grid gap-4 md:grid-cols-2">
		<div class="overflow-hidden rounded-lg bg-white shadow-sm">
			<div class="px-4 py-5 sm:p-6">
				<h2 class="mb-4 text-lg font-semibold">Item Details</h2>
				<div class="space-y-3 text-sm">
					<p><span class="font-medium">Type:</span> {item.type}</p>
					<p>
						<span class="font-medium">Status:</span>
						<span
							class={`ml-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
								item.status
							)}`}
						>
							{item.status}
						</span>
					</p>
					<p><span class="font-medium">Submitted:</span> {formatRelativeDate(item.submitted_at)}</p>
				</div>
			</div>
		</div>

		<div class="overflow-hidden rounded-lg bg-white shadow-sm">
			<div class="px-4 py-5 sm:p-6">
				<h2 class="mb-4 text-lg font-semibold">Submitter</h2>
				<div class="mb-4 flex items-center">
					{#if submitter.avatar_url}
						<img
							src={submitter.avatar_url}
							alt={submitter.name}
							class="mr-4 h-10 w-10 rounded-full"
						/>
					{:else}
						<div class="mr-4 h-10 w-10 rounded-full bg-gray-200"></div>
					{/if}
					<div>
						<p class="font-medium">{submitter.name}</p>
						<p class="text-xs text-gray-500">@{submitter.username}</p>
					</div>
				</div>
				<div class="space-y-2 text-sm">
					<p><span class="font-medium">Email:</span> {submitter.email}</p>
					<p>
						<span class="font-medium">Role:</span>
						<span
							class={`ml-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${getRoleColor(
								submitter.role
							)}`}
						>
							{submitter.role}
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
				{formatJSON(JSON.parse(item.data))}
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
