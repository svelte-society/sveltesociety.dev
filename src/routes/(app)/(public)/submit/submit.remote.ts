import { form, getRequestEvent, query } from '$app/server'
import { fail, redirect } from '@sveltejs/kit'

import { resourceSchema, videoSchema, librarySchema, recipeSchema } from './schema'
import { extractYouTubeVideoId, parseGitHubRepo } from './helpers'
import { uploadThumbnail, isS3Enabled } from '$lib/server/services/s3-storage'
import { generateSlug } from '$lib/utils/slug'

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
        const timestamp = Date.now()
        const key = `resource/${generateSlug(data.title)}-${timestamp}/thumbnail.${ext}`

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
    const slug = generateSlug(data.title)

    await locals.contentService.addContent(
      {
        title: data.title,
        type: 'resource',
        slug,
        description: data.description,
        status: 'pending_review',
        tags: data.tags,
        metadata: {
          link: data.link,
          image: image || undefined,
          submitter_notes: data.notes || '',
          submitted_at: new Date().toISOString()
        }
      },
      locals.user.id
    )
  } catch (error) {
    console.error('Error creating pending content:', error)
    return fail(500, { error: 'Failed to submit content' })
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

  const videoId = extractYouTubeVideoId(data.url)
  if (!videoId) {
    return fail(400, {
      error: 'Invalid URL',
      message: 'Could not extract video ID from the provided URL.'
    })
  }

  // Check for duplicates
  const existingContent = locals.externalContentService.getContentByExternalId('youtube', videoId)
  if (existingContent) {
    return {
      success: false,
      text: `This video has already been submitted. You can find it <a href="/${existingContent.type}/${existingContent.slug}" class="underline text-blue-600 hover:text-blue-800">here</a>.`
    }
  }

  // Try to fetch video metadata from YouTube API (optional - don't fail if unavailable)
  let title = ''
  let thumbnail = ''
  try {
    const metadata = await locals.metadataService.fetchYoutubeMetadata(videoId)
    title = metadata.title || ''
    thumbnail = metadata.thumbnail || ''
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error)
    // Continue without metadata - moderator will see video ID
  }

  try {
    const slug = generateSlug(title || `video-${videoId}`)

    await locals.contentService.addContent(
      {
        title: title || `YouTube Video: ${videoId}`,
        type: 'video',
        slug,
        description: data.description,
        status: 'pending_review',
        tags: data.tags,
        metadata: {
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnail: thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          youtubeVideoId: videoId,
          submitter_notes: data.notes || '',
          submitted_at: new Date().toISOString()
        }
      },
      locals.user.id
    )
  } catch (error) {
    console.error('Error creating pending video content:', error)
    return fail(500, { error: 'Failed to submit video' })
  }

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

  const { owner, repo, packagePath } = parseGitHubRepo(data.github_repo)

  if (!owner || !repo) {
    return fail(400, {
      error: 'Invalid repository',
      message: 'Could not parse GitHub repository from the provided input.'
    })
  }

  const externalId = packagePath ? `${owner}/${repo}/${packagePath}` : `${owner}/${repo}`
  const githubUrl = `https://github.com/${owner}/${repo}`

  // Check for duplicates
  const existingContent = locals.externalContentService.getContentByExternalId('github', externalId)
  if (existingContent) {
    return {
      success: false,
      text: `This ${packagePath ? 'package' : 'repository'} has already been submitted. You can find it <a href="/${existingContent.type}/${existingContent.slug}" class="underline text-blue-600 hover:text-blue-800">here</a>.`
    }
  }

  // Try to fetch repository metadata from GitHub API (optional - don't fail if unavailable)
  let stars = 0
  try {
    const metadata = await locals.metadataService.fetchGithubMetadata(githubUrl)
    stars = metadata.stars || 0
  } catch (error) {
    console.error('Error fetching GitHub metadata:', error)
    // Continue without metadata - moderator will see repo URL
  }

  try {
    const title = packagePath ? `${repo}/${packagePath}` : repo
    const slug = generateSlug(title)

    await locals.contentService.addContent(
      {
        title,
        type: 'library',
        slug,
        description: data.description || `GitHub repository: ${owner}/${repo}`,
        status: 'pending_review',
        tags: data.tags,
        metadata: {
          github: githubUrl,
          stars,
          githubOwner: owner,
          githubRepo: repo,
          packagePath: packagePath || undefined,
          submitter_notes: data.notes || '',
          submitted_at: new Date().toISOString()
        }
      },
      locals.user.id
    )
  } catch (error) {
    console.error('Error creating pending library content:', error)
    return fail(500, { error: 'Failed to submit library' })
  }

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
    const slug = generateSlug(data.title)

    await locals.contentService.addContent(
      {
        title: data.title,
        type: 'recipe',
        slug,
        description: data.description,
        body: data.body,
        status: 'pending_review',
        tags: data.tags,
        metadata: {
          submitter_notes: data.notes || '',
          submitted_at: new Date().toISOString()
        }
      },
      locals.user.id
    )
  } catch (error) {
    console.error('Error creating pending recipe content:', error)
    return fail(500, { error: 'Failed to submit recipe' })
  }

  redirect(302, '/submit/thankyou')
})
