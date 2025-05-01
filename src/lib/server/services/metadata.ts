import type { Database } from 'bun:sqlite'
import type { Content } from '$lib/types/content'

export class MetadataService {
  // Default staleness threshold (24 hours in milliseconds)
  private readonly STALE_THRESHOLD = 24 * 60 * 60 * 1000

  constructor(private db: Database) {}

  // NPM metadata methods
  async fetchNpmMetadata(packageName: string) {
    // TODO: Implement fetch from NPM API
    return {
      name: packageName,
      version: '',
      description: '',
      downloads: 0,
      stars: 0,
      lastUpdated: '',
      // Other relevant npm metadata
    }
  }

  // GitHub metadata methods
  async fetchGithubMetadata(repoUrl: string) {
    // TODO: Implement fetch from GitHub API
    return {
      owner: '',
      repo: '',
      stars: 0,
      forks: 0,
      issues: 0,
      lastUpdated: '',
      // Other relevant GitHub metadata
    }
  }

  // YouTube metadata methods
  async fetchYoutubeMetadata(videoId: string) {
    // TODO: Implement fetch from YouTube API
    return {
      title: '',
      description: '',
      channelName: '',
      publishedAt: '',
      views: 0,
      likes: 0,
      // Other relevant YouTube metadata
    }
  }

  /**
   * Get metadata for a content piece with stale-while-revalidate strategy
   * Returns current metadata immediately and updates if stale
   */
  getMetadata(content: Content): any {
    // Parse existing metadata
    let metadata = this.parseMetadata(content)
    
    // If metadata is stale, trigger a background refresh
    if (this.isMetadataStale(metadata)) {
      // Return current metadata immediately
      const currentMetadata = { ...metadata }
      
      // Refresh in background
      this.refreshMetadata(content.id, content.type, metadata)
        .catch(err => console.error(`Error refreshing metadata for content ${content.id}:`, err))
      
      return currentMetadata
    }
    
    return metadata
  }

  /**
   * Force refresh metadata for a content piece
   */
  async refreshMetadataForContent(content: Content): Promise<any> {
    const metadata = this.parseMetadata(content)
    const updatedMetadata = await this.refreshMetadata(content.id, content.type, metadata)
    return updatedMetadata
  }

  // Private helper methods
  
  /**
   * Parse metadata from content
   */
  private parseMetadata(content: Content): any {
    if (!content.metadata) return {}
    
    // If it's already an object, return it
    if (typeof content.metadata === 'object') {
      return content.metadata
    }
    
    // If it's a string, try to parse it
    if (typeof content.metadata === 'string') {
      try {
        return JSON.parse(content.metadata)
      } catch (err) {
        console.error('Error parsing metadata string:', err)
        return {}
      }
    }
    
    return {}
  }

  /**
   * Check if metadata is stale
   */
  private isMetadataStale(metadata: any): boolean {
    if (!metadata.updated_at) return true
    
    const updatedAt = new Date(metadata.updated_at).getTime()
    const now = Date.now()
    
    return (now - updatedAt) > this.STALE_THRESHOLD
  }

  /**
   * Update content with new metadata
   */
  private updateContentMetadata(contentId: string, metadata: any): void {
    const stmt = this.db.prepare(`
      UPDATE content
      SET metadata = ?
      WHERE id = ?
    `)
    
    stmt.run(JSON.stringify(metadata), contentId)
  }

  /**
   * Refresh metadata based on content type
   */
  private async refreshMetadata(contentId: string, contentType: string, currentMetadata: any): Promise<any> {
    // Create new metadata object with updated timestamp
    const newMetadata = { 
      ...currentMetadata,
      updated_at: new Date().toISOString()
    }
    
    switch (contentType) {
      case 'library':
        // Handle library content
        if (currentMetadata.npm) {
          newMetadata.npm = await this.fetchNpmMetadata(currentMetadata.npm)
        }
        
        if (currentMetadata.github?.repoUrl) {
          newMetadata.github = await this.fetchGithubMetadata(currentMetadata.github.repoUrl)
        }
        
        newMetadata.type = 'library'
        break
        
      case 'video':
        // Handle video content
        if (currentMetadata.videoId) {
          newMetadata.youtube = await this.fetchYoutubeMetadata(currentMetadata.videoId)
          newMetadata.type = 'video'
        }
        break
        
      // Add other content types as needed
    }
    
    // Update content with new metadata
    this.updateContentMetadata(contentId, newMetadata)
    
    return newMetadata
  }
} 