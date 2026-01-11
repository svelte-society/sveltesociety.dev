# form() - Form Submissions

Use `form` for handling form submissions with progressive enhancement.

## Basic Form

```ts
// data.remote.ts
import { z } from 'zod/v4'
import { redirect } from '@sveltejs/kit'
import { form } from '$app/server'
import * as db from '$lib/server/database'

export const createItem = form(
	z.object({
		name: z.string().min(1),
		description: z.string().min(1)
	}),
	async ({ name, description }) => {
		// TODO: Add your database insert
		await db.sql`
      INSERT INTO items (name, description)
      VALUES (${name}, ${description})
    `

		redirect(303, '/items')
	}
)
```

```svelte
<!-- Component.svelte -->
<script>
  import { createItem } from './data.remote';
</script>

<form {...createItem}>
  <label>
    Name
    <input {...createItem.fields.name.as('text')} />
  </label>

  <label>
    Description
    <textarea {...createItem.fields.description.as('text')}></textarea>
  </label>

  <button>Create</button>
</form>
```

## Displaying Validation Errors

```svelte
<form {...createItem}>
  <label>
    Name
    {#each createItem.fields.name.issues() as issue}
      <p class="error">{issue.message}</p>
    {/each}
    <input {...createItem.fields.name.as('text')} />
  </label>

  <!-- All issues at once -->
  {#each createItem.fields.allIssues() as issue}
    <p class="error">{issue.message}</p>
  {/each}

  <button>Create</button>
</form>
```

## Pending State (.pending)

Use `.pending` to show loading state during form submission:

```svelte
<form {...createItem}>
  <input {...createItem.fields.name.as('text')} />

  <button disabled={!!createItem.pending}>
    {createItem.pending ? 'Creating...' : 'Create'}
  </button>
</form>
```

### Disabling Form During Submission

```svelte
<form {...createItem}>
  <fieldset disabled={!!createItem.pending}>
    <input {...createItem.fields.name.as('text')} />
    <textarea {...createItem.fields.description.as('text')}></textarea>

    <button>
      {createItem.pending ? 'Submitting...' : 'Submit'}
    </button>
  </fieldset>
</form>
```

### Loading Spinner

```svelte
<form {...createItem}>
  <input {...createItem.fields.name.as('text')} />

  <button disabled={!!createItem.pending}>
    {#if createItem.pending}
      <Spinner /> Saving...
    {:else}
      Save
    {/if}
  </button>
</form>
```

## Result State (.result)

Use `.result` to access data returned from the form handler:

```ts
// data.remote.ts
export const createItem = form(schema, async (data) => {
	const item = await db.sql`
    INSERT INTO items (name) VALUES (${data.name})
    RETURNING id
  `

	return {
		success: true,
		id: item.id,
		message: 'Item created successfully'
	}
})
```

```svelte
<form {...createItem}>
  <input {...createItem.fields.name.as('text')} />
  <button>Create</button>
</form>

{#if createItem.result?.success}
  <div class="success">
    {createItem.result.message}
    <a href="/items/{createItem.result.id}">View item</a>
  </div>
{/if}
```

### Handling Success and Error Results

```ts
// data.remote.ts
export const updateSettings = form(schema, async (data) => {
	try {
		await db.updateSettings(data)
		return { success: true }
	} catch (e) {
		return { success: false, error: e.message }
	}
})
```

```svelte
<form {...updateSettings}>
  <!-- fields -->
  <button disabled={!!updateSettings.pending}>Save</button>
</form>

{#if updateSettings.result}
  {#if updateSettings.result.success}
    <p class="success">Settings saved!</p>
  {:else}
    <p class="error">{updateSettings.result.error}</p>
  {/if}
{/if}
```

### Result is Ephemeral

The `.result` value clears when:

- Form is resubmitted
- User navigates away
- Page is reloaded

```svelte
<script>
  import { createItem } from './data.remote';

  // Auto-hide success message after 3 seconds
  $effect(() => {
    if (createItem.result?.success) {
      const timeout = setTimeout(() => {
        // Result will clear on next submission anyway
      }, 3000);
      return () => clearTimeout(timeout);
    }
  });
</script>
```

## Combining .pending and .result

```svelte
<form {...createItem}>
  <input
    {...createItem.fields.name.as('text')}
    disabled={!!createItem.pending}
  />

  <button disabled={!!createItem.pending}>
    {#if createItem.pending}
      Creating...
    {:else}
      Create Item
    {/if}
  </button>
</form>

<!-- Status messages -->
{#if createItem.pending}
  <p class="info">Please wait...</p>
{:else if createItem.result?.success}
  <p class="success">Created successfully!</p>
{:else if createItem.result?.error}
  <p class="error">{createItem.result.error}</p>
{/if}
```

## Field Types - Complete Reference

All available input types for `.as()`:

### Text-Based Inputs

```svelte
<!-- Basic text -->
<input {...fields.name.as('text')} />

<!-- Email with validation -->
<input {...fields.email.as('email')} />

<!-- Password (use _ prefix for sensitive data) -->
<input {...fields._password.as('password')} />

<!-- URL -->
<input {...fields.website.as('url')} />

<!-- Telephone -->
<input {...fields.phone.as('tel')} />

<!-- Search -->
<input {...fields.query.as('search')} />

<!-- Hidden field (pass value as second arg) -->
<input {...fields.id.as('hidden', item.id)} />
```

### Numeric Inputs

```svelte
<!-- Number with coercion -->
<input {...fields.quantity.as('number')} />

<!-- Range slider -->
<input {...fields.volume.as('range')} min="0" max="100" />
```

### Date/Time Inputs

```svelte
<!-- Date picker -->
<input {...fields.birthdate.as('date')} />

<!-- DateTime local -->
<input {...fields.appointment.as('datetime-local')} />

<!-- Time only -->
<input {...fields.startTime.as('time')} />

<!-- Month picker -->
<input {...fields.expiryMonth.as('month')} />

<!-- Week picker -->
<input {...fields.weekNumber.as('week')} />
```

### Selection Inputs

```svelte
<!-- Radio buttons (pass value as second arg) -->
{#each ['small', 'medium', 'large'] as size}
  <label>
    <input {...fields.size.as('radio', size)} />
    {size}
  </label>
{/each}

<!-- Single select dropdown -->
<select {...fields.category.as('select')}>
  <option value="tech">Technology</option>
  <option value="design">Design</option>
</select>

<!-- Multi-select dropdown -->
<select {...fields.tags.as('select multiple')}>
  <option value="svelte">Svelte</option>
  <option value="kit">SvelteKit</option>
  <option value="js">JavaScript</option>
</select>
```

### Checkbox Inputs

```svelte
<!-- Single boolean checkbox -->
<input {...fields.acceptTerms.as('checkbox')} />

<!-- Multiple checkboxes (pass value as second arg) -->
{#each ['email', 'sms', 'push'] as method}
  <label>
    <input {...fields.notifications.as('checkbox', method)} />
    {method}
  </label>
{/each}
```

### File Inputs

```svelte
<!-- Single file -->
<input {...fields.avatar.as('file')} />

<!-- Multiple files -->
<input {...fields.attachments.as('file multiple')} />

<!-- With accept filter -->
<input {...fields.document.as('file')} accept=".pdf,.doc,.docx" />
```

### Other Inputs

```svelte
<!-- Color picker -->
<input {...fields.themeColor.as('color')} />

<!-- Submit button (rarely needed) -->
<button {...fields.action.as('submit')}>Submit</button>

<!-- Image button -->
<input {...fields.imageButton.as('image')} src="/submit.png" />
```

### Types Requiring a Second Argument

Some types require passing a value as the second argument to `.as()`:

```svelte
<!-- hidden: pass the value -->
<input {...fields.id.as('hidden', item.id)} />

<!-- radio: pass the option value -->
<input {...fields.size.as('radio', 'large')} />

<!-- checkbox (multiple): pass the option value -->
<input {...fields.tags.as('checkbox', 'svelte')} />
```

### Type Coercion

SvelteKit automatically coerces values based on the input type:

- `number` and `range` → coerced to JavaScript `number`
- `checkbox` (boolean) → coerced to `boolean`
- `file` → becomes `File` object
- `file multiple` → becomes `File[]` array

### Full Type Reference

| Type                | Schema Type             | Description                                |
| ------------------- | ----------------------- | ------------------------------------------ |
| `'text'`            | `string`                | Basic text input                           |
| `'email'`           | `string`                | Email with browser validation              |
| `'password'`        | `string`                | Masked password input                      |
| `'url'`             | `string`                | URL with browser validation                |
| `'tel'`             | `string`                | Telephone number                           |
| `'search'`          | `string`                | Search input                               |
| `'hidden'`          | `string`                | Hidden field (pass value as 2nd arg)       |
| `'number'`          | `number`                | Numeric input                              |
| `'range'`           | `number`                | Slider input                               |
| `'date'`            | `string`                | Date picker (YYYY-MM-DD)                   |
| `'datetime-local'`  | `string`                | DateTime picker                            |
| `'time'`            | `string`                | Time picker (HH:MM)                        |
| `'month'`           | `string`                | Month picker (YYYY-MM)                     |
| `'week'`            | `string`                | Week picker                                |
| `'checkbox'`        | `boolean` or `string[]` | Checkbox (pass value for multi)            |
| `'radio'`           | `string`                | Radio button group (pass value as 2nd arg) |
| `'select'`          | `string`                | Single select                              |
| `'select multiple'` | `string[]`              | Multi-select                               |
| `'file'`            | `File`                  | Single file upload                         |
| `'file multiple'`   | `File[]`                | Multiple file upload                       |
| `'color'`           | `string`                | Color picker (#RRGGBB)                     |

## Nested Fields

```ts
// data.remote.ts
import { z } from 'zod/v4'
import { form } from '$app/server'

const schema = z.object({
	user: z.object({
		name: z.string(),
		email: z.string().email()
	}),
	tags: z.array(z.string())
})

export const createProfile = form(schema, async (data) => {
	// data.user.name, data.user.email, data.tags
})
```

```svelte
<form {...createProfile}>
  <input {...createProfile.fields.user.name.as('text')} />
  <input {...createProfile.fields.user.email.as('email')} />
  <input {...createProfile.fields.tags[0].as('text')} />
  <input {...createProfile.fields.tags[1].as('text')} />
</form>
```

## Programmatic Validation

Validate on input or change:

```svelte
<form {...createItem} oninput={() => createItem.validate()}>
  <!-- fields -->
</form>
```

## Client-Side Preflight Validation

```svelte
<script>
  import { z } from 'zod/v4';
  import { createItem } from './data.remote';

  const schema = z.object({
    name: z.string().min(1),
    description: z.string().min(1)
  });
</script>

<form {...createItem.preflight(schema)}>
  <!-- Validates before sending to server -->
</form>
```

## Reading Field Values

```svelte
<form {...createItem}>
  <!-- fields -->
</form>

<div class="preview">
  <h2>{createItem.fields.name.value()}</h2>
  <p>{createItem.fields.description.value()}</p>
</div>
```

## Returning Data (Instead of Redirect)

```ts
export const createItem = form(schema, async (data) => {
	// ...
	return { success: true, id: newItem.id }
})
```

```svelte
{#if createItem.result?.success}
  <p>Created item #{createItem.result.id}</p>
{/if}
```

## Custom Enhancement

```svelte
<form {...createItem.enhance(async ({ form, data, submit }) => {
  try {
    await submit();
    form.reset();
    showToast('Success!');
  } catch (error) {
    showToast('Something went wrong');
  }
})}>
  <!-- fields -->
</form>
```

## Sensitive Data

Use underscore prefix to prevent repopulation on error:

```svelte
<input {...register.fields._password.as('password')} />
```
