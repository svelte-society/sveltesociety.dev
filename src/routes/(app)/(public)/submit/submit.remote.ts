import { form, getRequestEvent, query } from '$app/server'
import { fail, redirect } from '@sveltejs/kit'

import { resourceSchema, videoSchema, librarySchema } from './schema'
import { extractYouTubeVideoId, parseGitHubRepo } from './helpers'

export const getTags = query(() => {
  const { locals } = getRequestEvent()
  return locals.tagService.getTags({ limit: 50 }).map((tag) => ({
    label: tag.name,
    value: tag.id
  }))
})

export const submitResource = form(resourceSchema, async (data) => {
  const { locals } = getRequestEvent()
  if (!locals.user) {
    return fail(401, {
      error: 'Authentication required',
      message: 'You must be logged in to submit content.'
    })
  }

  try {
    locals.moderationService.addToModerationQueue({
      type: data.type,
      data: JSON.stringify(data),
      submitted_by: locals.user.id
    })
  } catch (error) {
    console.error('Error adding content to moderation queue:', error)
  }
  redirect(302, '/submit/thankyou')
})

export const submitVideo = form(videoSchema, async (data) => {
  const { locals } = getRequestEvent()
  if (!locals.user) {
    return fail(401, {
      error: 'Authentication required',
      message: 'You must be logged in to submit content.'
    })
  }

  let title: string | undefined = undefined

  const videoId = extractYouTubeVideoId(data.url)
  if (videoId) {
    const existingContent = locals.externalContentService.getContentByExternalId('youtube', videoId)
    if (existingContent) {
      return {
        success: false,
        text: `This video has already been submitted. You can find it <a href="/${existingContent.type}/${existingContent.slug}" class="underline text-blue-600 hover:text-blue-800">here</a>.`
      }
    }

    // Fetch video title from YouTube API
    try {
      const metadata = await locals.metadataService.fetchYoutubeMetadata(videoId)
      title = metadata.title

      locals.moderationService.addToModerationQueue({
        type: data.type,
        data: JSON.stringify({
          ...data,
          title
        }),
        submitted_by: locals.user.id
      })
      redirect(302, '/submit/thankyou')
    } catch (error) {
      console.error('Error fetching YouTube metadata:', error)
    }
  }
})

export const submitLibrary = form(librarySchema, async (data) => {
  const { locals } = getRequestEvent()
  if (!locals.user) {
    return fail(401, {
      error: 'Authentication required',
      message: 'You must be logged in to submit content.'
    })
  }


  const { owner, repo, packagePath } = parseGitHubRepo(data.github_repo)

  if (owner && repo) {
    const externalId = packagePath ? `${owner}/${repo}/${packagePath}` : `${owner}/${repo}`

    const existingContent = locals.externalContentService.getContentByExternalId(
      'github',
      externalId
    )
    if (existingContent) {
      return {
        success: false,
        text: `This ${packagePath ? 'package' : 'repository'} has already been submitted. You can find it <a href="/${existingContent.type}/${existingContent.slug}" class="underline text-blue-600 hover:text-blue-800">here</a>.`
      }
    }

    try {
      const title = await locals.externalContentService.getGithubMetadata(owner, repo, packagePath || undefined)

      locals.moderationService.addToModerationQueue({
        type: data.type,
        data: JSON.stringify({
          ...data,
          title: title ? title : repo
        }),
        submitted_by: locals.user.id
      })
    } catch (error) {
      console.error('Error fetching GitHub metadata:', error)
    }
    redirect(302, '/submit/thankyou')
  }

})
