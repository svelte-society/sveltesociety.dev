-- Add default social media templates
INSERT OR IGNORE INTO social_templates (content_type, platform, template, is_default) VALUES
-- Recipe templates
('recipe', 'bluesky', '🍳 New Svelte Recipe: {{title}}

{{description}}

Check it out: {{url}}

#svelte #sveltekit #webdev {{tags}}', 1),

('recipe', 'nostr', '🍳 New Svelte Recipe: {{title}}

{{description}}

Learn more: {{url}}

#svelte #sveltekit #webdev', 1),

('recipe', 'linkedin', '🍳 New Svelte Recipe: {{title}}

{{description}}

Read the full recipe: {{url}}

#Svelte #SvelteKit #WebDevelopment', 1),

-- Video templates
('video', 'bluesky', '🎥 New Video: {{title}}

{{description}}

Watch now: {{url}}

#svelte #tutorial #webdev {{tags}}', 1),

('video', 'nostr', '🎥 New Video: {{title}}

{{description}}

Watch: {{url}}

#svelte #tutorial', 1),

('video', 'linkedin', '🎥 New Video: {{title}}

{{description}}

Watch the full video: {{url}}

#Svelte #WebDevelopment #Tutorial', 1),

-- Library templates
('library', 'bluesky', '📚 Check out this library: {{title}}

{{description}}

Explore: {{url}}

#svelte #library #webdev {{tags}}', 1),

('library', 'nostr', '📚 Check out: {{title}}

{{description}}

{{url}}

#svelte #library', 1),

('library', 'linkedin', '📚 Library Spotlight: {{title}}

{{description}}

Learn more: {{url}}

#Svelte #OpenSource #WebDevelopment', 1),

-- Announcement templates
('announcement', 'bluesky', '📢 {{title}}

{{description}}

Read more: {{url}}

#svelte #announcement {{tags}}', 1),

('announcement', 'nostr', '📢 {{title}}

{{description}}

{{url}}

#svelte', 1),

('announcement', 'linkedin', '📢 Announcement: {{title}}

{{description}}

Details: {{url}}

#Svelte #Community', 1),

-- Collection templates
('collection', 'bluesky', '✨ New Collection: {{title}}

{{description}}

Browse: {{url}}

#svelte #collection {{tags}}', 1),

('collection', 'nostr', '✨ Collection: {{title}}

{{description}}

{{url}}

#svelte', 1),

('collection', 'linkedin', '✨ Featured Collection: {{title}}

{{description}}

View collection: {{url}}

#Svelte #WebDevelopment', 1);
