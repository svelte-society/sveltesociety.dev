<script lang="ts" generics="T">
	import Table from './Table.svelte'
	import Actions from './Actions.svelte'
	import Badge from './Badge.svelte'
	import Pagination from '../Pagination.svelte'
	import type { Snippet } from 'svelte'
	import type { TableColumn, BadgeVariant } from '$lib/admin'
	import { formatRelativeDate } from '$lib/utils/date'

	interface Props<T> {
		data: T[]
		columns: TableColumn<T>[]
		entityName: string
		entityRoute: string
		pagination?: {
			count: number
			perPage: number
		}
		canEdit?: boolean
		canDelete?: boolean
		getItemTitle?: (item: T) => string
		renderCell?: (item: T, column: TableColumn<T>) => string | null
		customColumns?: Record<string, (item: T) => Snippet>
		renderBadge?: (value: any) => { text: string; variant: BadgeVariant } | null
	}

	let {
		data,
		columns,
		entityName,
		entityRoute,
		pagination,
		canEdit = true,
		canDelete = true,
		getItemTitle,
		renderCell,
		customColumns,
		renderBadge
	}: Props<T> = $props()

	function formatCellValue(item: T, column: TableColumn<T>): string {
		const value = item[column.key]

		if (column.format) {
			return column.format(value)
		}

		// Default formatting
		if (value === null || value === undefined) return ''
		if (value instanceof Date) return formatRelativeDate(value.toISOString())
		if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
			return formatRelativeDate(value)
		}
		if (typeof value === 'boolean') return value ? 'Yes' : 'No'
		if (typeof value === 'number') return value.toString()

		return String(value)
	}
</script>

<Table action={canEdit || canDelete} data={data ?? []}>
	{#snippet header(classes)}
		{#each columns as column}
			<th scope="col" class={classes}>{column.label}</th>
		{/each}
	{/snippet}

	{#snippet row(item: T, classes)}
		{#each columns as column, index}
			<td class={classes} class:font-medium={index === 0} class:text-gray-900={index === 0}>
				{#if renderCell}
					{@const customRender = renderCell(item, column)}
					{#if customRender}
						{#if typeof customRender === 'string'}
							{customRender}
						{:else}
							{@render customRender()}
						{/if}
					{:else}
						{@const badgeData = renderBadge?.(item[column.key])}
						{#if badgeData}
							<Badge variant={badgeData.variant}>{badgeData.text}</Badge>
						{:else}
							{formatCellValue(item, column)}
						{/if}
					{/if}
				{:else}
					{formatCellValue(item, column)}
				{/if}
			</td>
		{/each}
	{/snippet}

	{#snippet actionCell(item: T)}
		<Actions
			route={entityRoute}
			id={item.id as string}
			{canDelete}
			{canEdit}
			type={getItemTitle ? getItemTitle(item) : entityName}
		/>
	{/snippet}
</Table>

{#if pagination && pagination.count > 0}
	<Pagination count={pagination.count} perPage={pagination.perPage} />
{/if}
