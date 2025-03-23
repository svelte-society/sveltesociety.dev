<script lang="ts">
import { superForm } from 'sveltekit-superforms/client';
import Form from '$lib/ui/form/Form.svelte';
import Input from '$lib/ui/form/Input.svelte';
import SuperDebug from 'sveltekit-superforms';
import Select from '$lib/ui/form/Select.svelte';
import { options } from './schema';
	import Textarea from '$lib/ui/form/Textarea.svelte';
let { data } = $props();

const form = superForm(data.form, {
  resetForm: true,
  delayMs: 500,
  timeoutMs: 8000
});

const { form: formData } = form
</script>

<div class="max-w-3xl mx-auto">
  <h1 class="text-2xl font-bold mb-6">Submit Content</h1>
  <Form {form} action="?/submit">
    <Input
        placeholder="Enter a title..."
        name="title"
        label="Title"
        description="Enter the title of your content submission"
      />
    <Textarea
        placeholder="Enter a description..."
        name="description"
        label="Description"
        description="Enter the description of your content submission."
      />
    <Select
        name="type"
        label="Type"
        description="Select the type of content you are submitting"
        {options}
    />
    <Input
      placeholder="Enter the URL"
      name="url"
      label="Url"
      description="The URL for the resource you are submitting."
    />
    <Input
      placeholder="Enter the GitHub repo"
      name="github_repo"
      label="GitHub Repository"
      description="Enter the GitHub repo for the resource you are submitting."
    />
    <Textarea
      placeholder="Enter notes"
      name="notes"
      label="Notes"
      description="Enter the notes for the resource you are submitting."
    />
  </Form>
  <div class="grid gap-6">
    <div class="mt-4">
      <button
        type="submit"
        class="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md font-medium"
        disabled={false}
      >
        {#if false}
          <span class="inline-block animate-spin mr-2">↻</span>
          Submitting...
        {:else}
          Submit Content
        {/if}
      </button>
      
      {#if false}
        <p class="text-sm text-gray-500 mt-2">
          Your submission is being processed, please wait...
        </p>
      {/if}
    </div>
  </div>
</div>

<SuperDebug data={$formData} />