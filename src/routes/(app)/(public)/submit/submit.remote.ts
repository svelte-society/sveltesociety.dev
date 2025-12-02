import { form, getRequestEvent, query } from '$app/server'
import { fail, redirect } from '@sveltejs/kit'

import { resourceSchema, videoSchema, librarySchema, recipeSchema } from './schema'
import { extractYouTubeVideoId, parseGitHubRepo } from './helpers'
import { uploadThumbnail, isS3Enabled } from '$lib/server/services/s3-storage'

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

  let image: string | undefined = undefined

  // Fetch og:image from the resource URL and upload to S3
  try {
    const ogImageUrl = await fetchOgImage(data.link)
    if (ogImageUrl) {
      const imageResponse = await fetch(ogImageUrl, {
        headers: { 'User-Agent': 'SvelteSociety-Bot/1.0' },
        signal: AbortSignal.timeout(10000)
      })

      if (imageResponse.ok) {
        const arrayBuffer = await imageResponse.arrayBuffer()
        const contentType = imageResponse.headers.get('content-type') || 'image/png'
        const ext = contentType.split('/').at(-1) || 'png'

        // Generate a unique key based on timestamp and title
        const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)
        const timestamp = Date.now()
        const key = `resource/${slug}-${timestamp}/thumbnail.${ext}`

        if (isS3Enabled) {
          image = await uploadThumbnail(key, arrayBuffer)
        }
      }
    }
  } catch (error) {
    console.error('Error fetching/uploading resource thumbnail:', error)
    // Continue without image - not a blocking error
  }

  try {
    locals.moderationService.addToModerationQueue({
      type: data.type,
      data: JSON.stringify({ ...data, image }),
      submitted_by: locals.user.id
    })
  } catch (error) {
    console.error('Error adding content to moderation queue:', error)
  }
  redirect(302, '/submit/thankyou')
})

/**
 * Fetch og:image URL from a webpage
 */
async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SvelteSociety-Bot/1.0',
        Accept: 'text/html'
      },
      signal: AbortSignal.timeout(10000)
    })

    if (!response.ok) return null

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) return null

    const html = await response.text()

    // Extract og:image from meta tags
    const propertyRegex = /<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["']([^"']+)["']/i
    const contentFirstRegex = /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image["']/i

    const match = html.match(propertyRegex) || html.match(contentFirstRegex)
    if (!match) return null

    let ogImage = match[1]

    // Resolve relative URLs to absolute
    if (!ogImage.startsWith('http')) {
      const baseUrl = new URL(url)
      ogImage = new URL(ogImage, baseUrl).toString()
    }

    return ogImage
  } catch (error) {
    console.error('Error fetching og:image:', error)
    return null
  }
}

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
    } catch (error) {
      console.error('Error fetching YouTube metadata:', error)
      // Continue without title - will show "<No Title>" in moderation queue
    }
  }

  locals.moderationService.addToModerationQueue({
    type: data.type,
    data: JSON.stringify({
      ...data,
      title
    }),
    submitted_by: locals.user.id
  })
  redirect(302, '/submit/thankyou')
})

export const submitLibrary = form(librarySchema, async (data) => {
  const { locals } = getRequestEvent()
  if (!locals.user) {
    return fail(401, {
      error: 'Authentication required',
      message: 'You must be logged in to submit content.'
    })
  }

  let title: string | undefined = undefined
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
      title = await locals.externalContentService.getGithubMetadata(owner, repo, packagePath || undefined)
    } catch (error) {
      console.error('Error fetching GitHub metadata:', error)
      // Continue without title - will use repo name as fallback
    }

    title = title || repo
  }

  locals.moderationService.addToModerationQueue({
    type: data.type,
    data: JSON.stringify({
      ...data,
      title
    }),
    submitted_by: locals.user.id
  })
  redirect(302, '/submit/thankyou')
})

export const submitRecipe = form(recipeSchema, async (data) => {
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
