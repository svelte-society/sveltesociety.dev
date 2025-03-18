<script lang="ts">
import { superForm, type SuperForm } from 'sveltekit-superforms/client';
import Input from '$lib/ui/form/Input.svelte';
import Select from '$lib/ui/form/Select.svelte';
import type { Tag } from '$lib/server/db/tags';

let { data } = $props();

const { form, errors, enhance, submitting, delayed, message, constraints } = superForm(data.form, {
  onError: () => console.error('Form submission failed'),
  resetForm: true,
  delayMs: 500,
  timeoutMs: 8000,
});

let selectedTags = $state<string[]>([]);

function handleTagSelection() {
  const selectElement = document.querySelector('select[name="tag-selector"]') as HTMLSelectElement;
  if (!selectElement) return;
  
  const value = selectElement.value;
  if (value && !selectedTags.includes(value)) {
    selectedTags = [...selectedTags, value];
    // @ts-ignore - We know the structure of our form
    $form.tags = selectedTags;
  }
}

function removeTag(tag: string) {
  selectedTags = selectedTags.filter((t) => t !== tag);
  // @ts-ignore - We know the structure of our form
  $form.tags = selectedTags;
}

const contentTypes = [
  { value: 'article', label: 'Article' },
  { value: 'component', label: 'Component' },
  { value: 'recipe', label: 'Recipe' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'snippet', label: 'Code Snippet' },
  { value: 'other', label: 'Other' }
];
</script>

<div class="max-w-3xl mx-auto">
  <h1 class="text-2xl font-bold mb-6">Submit Content</h1>
  
  <form method="POST" use:enhance>
    <div class="grid gap-6">
      <Input
        placeholder="Enter a title..."
        name="title"
        label="Title"
        description="Enter the title of your content submission"
        errors={$errors.title}
        type="text"
        value={$form.title}
        {...$constraints.title}
      />
      
      <Input
        placeholder="A brief description of your content"
        name="description"
        label="Description"
        description="Summarize your submission in 1-2 sentences"
        errors={$errors.description}
        type="text"
        value={$form.description}
        {...$constraints.description}
      />
      
      <Select
        name="content_type"
        label="Content Type"
        description="What type of content are you submitting?"
        options={contentTypes}
        errors=""
        value={$form.content_type}
      />
      
      <div class="form-field">
        <label for="tags" class="block font-medium mb-1">Tags</label>
        <p class="text-sm text-gray-500 mb-2">Select relevant tags for your content</p>
        
        <div class="flex flex-wrap gap-2 mb-2">
          {#each selectedTags as tag}
            <div class="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center">
              <span>{tag}</span>
              <button 
                type="button" 
                class="ml-2" 
                onclick={() => removeTag(tag)}
                aria-label={`Remove ${tag} tag`}
              >
                ×
              </button>
            </div>
          {/each}
        </div>
        
        <div class="flex gap-2">
          <select 
            name="tag-selector" 
            class="w-full rounded-md border border-gray-300 p-2"
            onchange={handleTagSelection}
          >
            <option value="">Select a tag...</option>
            {#each data.tags as tag}
              <option value={tag.id}>{tag.name}</option>
            {/each}
          </select>
        </div>
        
        {#if $errors.tags}
          <div class="text-red-500 text-sm mt-1">{$errors.tags}</div>
        {/if}
        <input type="hidden" name="tags" value={JSON.stringify($form.tags || [])} />
      </div>
      
      <Input
        placeholder="https://example.com/your-content"
        name="url"
        label="URL (optional)"
        description="Link to your content if it's published elsewhere"
        errors={$errors.url}
        type="url"
        value={$form.url}
        {...$constraints.url}
      />
      
      <Input
        placeholder="username/repository"
        name="github_repo"
        label="GitHub Repository (optional)"
        description="If your submission is on GitHub, enter the repository name"
        errors={$errors.github_repo}
        type="text"
        value={$form.github_repo}
        {...$constraints.github_repo}
      />
      
      <div class="grid md:grid-cols-2 gap-6">
        <Input
          placeholder="Your name"
          name="author_name"
          label="Author Name"
          description="Your name or username"
          errors={$errors.author_name}
          type="text"
          value={$form.author_name}
          {...$constraints.author_name}
        />
        
        <Input
          placeholder="your-email@example.com"
          name="author_email"
          label="Author Email"
          description="We'll contact you here about your submission"
          errors={$errors.author_email}
          type="email"
          value={$form.author_email}
          {...$constraints.author_email}
        />
      </div>
      
      <div class="form-field">
        <label for="notes" class="block font-medium mb-1">Additional Notes (optional)</label>
        <p class="text-sm text-gray-500 mb-2">Any extra information that might help us evaluate your submission</p>
        <textarea
          id="notes"
          name="notes"
          rows="4"
          class="w-full rounded-md border border-gray-300 p-2"
          placeholder="Additional information..."
          bind:value={$form.notes}
          {...$constraints.notes}
        ></textarea>
      </div>
      
      <div class="mt-4">
        <button
          type="submit"
          class="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md font-medium"
          disabled={$submitting}
        >
          {#if $submitting}
            <span class="inline-block animate-spin mr-2">↻</span>
            Submitting...
          {:else}
            Submit Content
          {/if}
        </button>
        
        {#if $delayed}
          <p class="text-sm text-gray-500 mt-2">
            Your submission is being processed, please wait...
          </p>
        {/if}
      </div>
    </div>
  </form>
  
  {#if $message}
    <div class="mt-6 p-4 rounded-md {$message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
      {$message.text}
    </div>
  {/if}
</div>
