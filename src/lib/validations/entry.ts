import { z } from 'zod'

export const entrySchema = z.object({
  content: z.string().min(1, 'Content is required').max(5000, 'Content too long'),
  entry_type: z.enum(['text', 'voice', 'quick-check']),
})

export type EntryFormData = z.infer<typeof entrySchema>


