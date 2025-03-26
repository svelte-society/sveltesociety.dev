<script lang="ts">
import { superForm } from 'sveltekit-superforms/client';
import { zodClient } from 'sveltekit-superforms/adapters';
import { contentSchema } from '$lib/schema/content';
import Input from '$lib/ui/form/Input.svelte';
import Select from '$lib/ui/form/Select.svelte';
import Textarea from '$lib/ui/form/Textarea.svelte';
import MarkdownEditor from '$lib/ui/MarkdownEditor.svelte';
import Form from '$lib/ui/form/Form.svelte';
import Button from '$lib/ui/Button.svelte';
import { slide } from 'svelte/transition';
import { slugify } from '$lib/utils/slug';
import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

// Get data passed from server
let { data } = $props();

// Setup form with client-side validation
const form = superForm(data.form, {
  validators: zodClient(contentSchema),
  dataType: 'json'
});

const { form: formData, errors, submitting } = form;

// Helper for video preview
async function fetchVideoInfo(id: string) {
  if (!id) return undefined;
  
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https%3A//youtube.com/watch%3Fv%3D${id}&format=json`
    );
    const data = await response.json();
    return {
      preview: data.thumbnail_url,
      title: data.title,
      author: data.author_name
    };
  } catch (error) {
    return undefined;
  }
}

// Helper for npm package info
async function fetchNpmInfo(packageName: string) {
  if (!packageName) return undefined;
  
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);
    const data = await response.json();
    return {
      name: data.name,
      description: data.description,
      keywords: data.keywords || [],
      maintainers: (data.maintainers || []).map((m: {name: string}) => m.name),
      versions: Object.keys(data.versions || {})
    };
  } catch (error) {
    return undefined;
  }
}

// Helper to generate slug from title
function generateSlug() {
  if ($formData.title) {
    formData.update(f => ({ ...f, slug: slugify(f.title as string) }));
  }
}

// Safe getters for metadata
function getVideoId(): string {
  const metadata = $formData.metadata as {videoId?: string} || {};
  return metadata.videoId || '';
}

function getNpmPackage(): string {
  const metadata = $formData.metadata as {npm?: string} || {};
  return metadata.npm || '';
}
</script>

<div class="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
  <h1 class="mb-6 text-3xl font-bold text-gray-800">
    Create New Content
  </h1>
  
  <Form {form}>
    <Input
      name="title"
      label="Title"
      placeholder="Title of your content"
      description="Enter a descriptive title"
    />
    
    <Select
      name="type"
      label="Content Type"
      description="Select the type of content"
      options={[
        { value: 'recipe', label: 'Recipe' },
        { value: 'video', label: 'Video' },
        { value: 'library', label: 'Library' },
        { value: 'announcement', label: 'Announcement' },
        { value: 'showcase', label: 'Showcase' }
      ]}
    />
    
    <Select
      name="status"
      label="Status"
      description="Select the publication status"
      options={[
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' }
      ]}
    />
    
    {#if $formData.type === 'video'}
      <div transition:slide class="space-y-2">
        <Input
          name="metadata.videoId"
          label="YouTube Video ID"
          placeholder="e.g. dQw4w9WgXcQ"
          description="Enter the YouTube video ID"
        />
        
        {#if getVideoId()}
          {#await fetchVideoInfo(getVideoId()) then info}
            {#if info}
              <div class="mx-4 flex gap-4 rounded-md bg-slate-100 p-4 text-sm">
                <img src={info.preview} alt="Video preview" class="max-w-xs rounded" />
                <div>
                  <strong>{info.title}</strong>
                  <div><i>by</i> {info.author}</div>
                </div>
              </div>
            {/if}
          {/await}
        {/if}
      </div>
    {/if}
    
    {#if $formData.type === 'library' || $formData.type === 'showcase'}
      <div transition:slide class="space-y-2">
        <Input
          name="metadata.npm"
          label="NPM Package"
          placeholder="e.g. svelte or @sveltejs/kit"
          description="Enter the NPM package name"
        />
        
        {#if getNpmPackage()}
          {#await fetchNpmInfo(getNpmPackage()) then info}
            {#if info}
              <div class="mx-4 rounded-md bg-slate-100 p-4 text-sm">
                <div class="flex items-center gap-4">
                  <strong class="text-lg">{info.name}</strong>
                  <p>{info.description}</p>
                </div>
                <dl class="mt-4">
                  <dt class="font-semibold text-slate-600">Maintainers</dt>
                  <dd class="pl-4">{info.maintainers.join(', ')}</dd>
                  
                  <dt class="font-semibold text-slate-600">Keywords</dt>
                  <dd class="pl-4">{info.keywords.join(', ')}</dd>
                </dl>
                
                <div class="mt-3 flex justify-end gap-2">
                  <Button on:click={() => formData.update(f => ({...f, title: info.name}))}>
                    Use as Title
                  </Button>
                  <Button on:click={() => formData.update(f => ({...f, description: info.description}))}>
                    Use as Description
                  </Button>
                </div>
              </div>
            {/if}
          {/await}
        {/if}
      </div>
    {/if}
    
    <div class="space-y-2">
      <label for="body" class="block text-sm font-medium text-gray-700">Content Body</label>
      <div class="w-full rounded-md border border-gray-300 bg-white">
        <MarkdownEditor name="body" />
      </div>
    </div>
    
    <div class="flex items-end gap-2">
      <Input
        name="slug"
        label="URL Slug"
        placeholder="url-friendly-name"
        description="The slug used in the URL (auto-generated from title)"
      />
      <Button on:click={generateSlug} style="margin-bottom: 0.5rem;">
        Generate
      </Button>
    </div>
    
    <Textarea
      name="description"
      label="Description"
      placeholder="Brief description of this content"
      description="A short summary that appears in listings and search results"
    />
    
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Tags</label>
      <div class="text-sm text-gray-500">
        <!-- Tag selection placeholder - implement with proper component -->
        <p>Tag selection component needed</p>
        <Input type="hidden" name="tags" value={["placeholder"]} />
      </div>
    </div>
    
    <Button type="submit" primary fullWidth disabled={$submitting}>
      {$submitting ? 'Creating...' : 'Create Content'}
    </Button>
  </Form>
</div>

<!-- Debug only in development -->
{#if import.meta.env?.DEV}
  <SuperDebug data={$formData} />
{/if} 