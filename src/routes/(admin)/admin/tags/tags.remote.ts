import { form, getRequestEvent, query } from '$app/server'
import { redirect } from '@sveltejs/kit'
import { createTagSchema, updateTagSchema, deleteTagSchema } from '$lib/schema/tags'
import { checkAuth } from '../authorization.remote'
import z from 'zod/v4'

export const getTags = query(() => {
  checkAuth()
  const { locals } = getRequestEvent()
  return locals.tagService.getAllTags()
})

export const getTagById = query(z.string(), (id: string) => {
  checkAuth()
  const { locals } = getRequestEvent()
  return locals.tagService.getTag(id)
})

export const createTag = form(createTagSchema, async (data) => {
  checkAuth()
  const { locals } = getRequestEvent()
  locals.tagService.createTag(data)
  redirect(303, '/admin/tags')
})

export const updateTag = form(updateTagSchema, async (data) => {
  checkAuth()
  const { locals } = getRequestEvent()
  locals.tagService.updateTag(data)
  redirect(303, '/admin/tags')
})

export const deleteTag = form(deleteTagSchema, async (data) => {
  checkAuth()
  const { locals } = getRequestEvent()
  locals.tagService.deleteTag(data.id)
  return { success: true, text: 'Tag deleted successfully!' }
})
