export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

export function parseGitHubRepo(
  input: string
): { owner: string; repo: string; packagePath?: string } | { owner: string; repo: string; packagePath?: undefined } {
  // Pattern for full GitHub URL with optional package path
  const urlPattern = /^https?:\/\/github\.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)(?:\/tree\/[^/]+\/(.+))?/
  const urlMatch = input.match(urlPattern)
  if (urlMatch) {
    return {
      owner: urlMatch[1],
      repo: urlMatch[2].replace(/\.git$/, ''), // Remove .git suffix if present
      packagePath: urlMatch[3] // Optional package path
    }
  }

  // Pattern for short format with optional package path: owner/repo or owner/repo/path
  const repoPattern = /^([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)(?:\/(.+))?$/
  const repoMatch = input.match(repoPattern)
  if (repoMatch) {
    return {
      owner: repoMatch[1],
      repo: repoMatch[2],
      packagePath: repoMatch[3] // Optional package path
    }
  }

  return { owner: null, repo: null }
}
