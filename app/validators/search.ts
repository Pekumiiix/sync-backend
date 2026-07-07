import vine from '@vinejs/vine'
import { type Infer } from '@vinejs/vine/types'

export const searchQueryValidator = vine.create({
  query: vine.string().minLength(1).maxLength(255),
  page: vine.number().optional(),
  limit: vine.number().optional(),
})

export type SearchQueryParams = Infer<typeof searchQueryValidator>
