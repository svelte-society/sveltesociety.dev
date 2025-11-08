/**
 * OG Image Layout for Video content
 * Shows: YouTube thumbnail as background/overlay, type badge, title
 */

import type { SatoriNode, VideoContentData } from '../types'
import { OG_IMAGE_COLORS } from '../constants'
import { createTypeBadge, createBrandingFooter, imageUrlToBase64 } from '../utils'

export async function createVideoLayout(content: VideoContentData): Promise<SatoriNode> {
	// Try to get the best thumbnail quality
	let thumbnailUrl: string | undefined
	let thumbnailBase64: string | null = null

	if (content.metadata?.thumbnails) {
		thumbnailUrl =
			content.metadata.thumbnails.maxres?.url ||
			content.metadata.thumbnails.standard?.url ||
			content.metadata.thumbnails.high?.url ||
			content.metadata.thumbnail
	} else if (content.metadata?.thumbnail) {
		thumbnailUrl = content.metadata.thumbnail
	}

	if (thumbnailUrl) {
		thumbnailBase64 = await imageUrlToBase64(thumbnailUrl)
	}

	// If we have a thumbnail, create an overlay layout
	if (thumbnailBase64) {
		return {
			type: 'div',
			props: {
				style: {
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
					height: '100%',
					position: 'relative',
					fontFamily: 'Inter'
				},
				children: [
					// Background thumbnail with overlay
					{
						type: 'div',
						props: {
							style: {
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								display: 'flex'
							},
							children: [
								{
									type: 'img',
									props: {
										src: thumbnailBase64,
										style: {
											width: '100%',
											height: '100%',
											objectFit: 'cover'
										}
									}
								}
							]
						}
					},
					// Dark overlay for readability
					{
						type: 'div',
						props: {
							style: {
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)'
							}
						}
					},
					// Content overlay
					{
						type: 'div',
						props: {
							style: {
								position: 'relative',
								display: 'flex',
								flexDirection: 'column',
								height: '100%',
								padding: '40px',
								justifyContent: 'space-between'
							},
							children: [
								// Top section with badge
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											flexDirection: 'column'
										},
										children: [createTypeBadge('Video')]
									}
								},
								// Bottom section with title and branding
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											flexDirection: 'column',
											gap: '32px'
										},
										children: [
											// Title
											{
												type: 'div',
												props: {
													style: {
														fontSize: '56px',
														fontWeight: '800',
														lineHeight: '1.1',
														color: 'white',
														textShadow: '0 2px 8px rgba(0,0,0,0.5)',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														display: '-webkit-box',
														WebkitLineClamp: '2',
														WebkitBoxOrient: 'vertical'
													},
													children: content.title
												}
											},
											// Branding footer with white text
											{
												type: 'div',
												props: {
													style: {
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'flex-end'
													},
													children: {
														type: 'div',
														props: {
															style: {
																fontSize: '24px',
																color: 'white',
																fontWeight: '600',
																textShadow: '0 2px 4px rgba(0,0,0,0.5)'
															},
															children: 'sveltesociety.dev'
														}
													}
												}
											}
										]
									}
								}
							]
						}
					}
				]
			}
		}
	}

	// Fallback layout without thumbnail
	return {
		type: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100%',
				background: OG_IMAGE_COLORS.background,
				color: OG_IMAGE_COLORS.text,
				position: 'relative',
				fontFamily: 'Inter'
			},
			children: [
				// Orange accent bar
				{
					type: 'div',
					props: {
						style: {
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							height: '8px',
							background: OG_IMAGE_COLORS.accentGradient
						}
					}
				},
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							flexDirection: 'column',
							height: '100%',
							padding: '40px'
						},
						children: [
							createTypeBadge('Video'),
							{
								type: 'div',
								props: {
									style: {
										fontSize: '72px',
										fontWeight: '800',
										lineHeight: '1.1',
										marginBottom: 'auto',
										maxWidth: '100%',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										display: '-webkit-box',
										WebkitLineClamp: '3',
										WebkitBoxOrient: 'vertical',
										color: OG_IMAGE_COLORS.text
									},
									children: content.title
								}
							},
							createBrandingFooter()
						]
					}
				}
			]
		}
	}
}
