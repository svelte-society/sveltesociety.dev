export { default as Actions } from './Actions.svelte'
export { default as Edit } from './Edit.svelte'
export { default as Delete } from './Delete.svelte'
export { default as Button } from './Button.svelte'

// Re-export as namespace for convenient usage
import Edit from './Edit.svelte'
import Delete from './Delete.svelte'
import Button from './Button.svelte'

export const Action = { Edit, Delete, Button }
