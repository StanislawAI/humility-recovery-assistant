import { z } from 'zod'

export const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
})

export const userSettingsSchema = z.object({
  emergency_contacts: z.array(emergencyContactSchema),
  preferences: z.record(z.string(), z.unknown()).optional(),
})

export const dailyChecklistSchema = z.object({
  date: z.string(),
  status: z.record(z.string(), z.boolean()),
})

export const urgeLogSchema = z.object({
  trigger: z.string().optional(),
  intensity: z.number().min(1).max(10).optional(),
  tools_used: z.array(z.string()).optional(),
  result: z.string().optional(),
  lesson: z.string().optional(),
})

export const ifThenPlanSchema = z.object({
  trigger: z.string().min(1, 'Trigger is required'),
  action: z.string().min(1, 'Action is required'),
  active: z.boolean().optional().default(true),
})

export const dailyMetricsSchema = z.object({
  date: z.string(),
  conn: z.number().optional(),
  pray: z.number().optional(),
  move: z.number().optional(),
  mind: z.number().optional(),
  service: z.number().optional(),
  sleep: z.number().optional(),
})

export const exerciseSessionSchema = z.object({
  type: z.string().min(1, 'Exercise type is required'),
  notes: z.string().optional(),
  duration_sec: z.number().optional(),
})

export type EmergencyContact = z.infer<typeof emergencyContactSchema>
export type UserSettingsInput = z.infer<typeof userSettingsSchema>
export type DailyChecklistInput = z.infer<typeof dailyChecklistSchema>
export type UrgeLogInput = z.infer<typeof urgeLogSchema>
export type IfThenPlanInput = z.infer<typeof ifThenPlanSchema>
export type DailyMetricsInput = z.infer<typeof dailyMetricsSchema>
export type ExerciseSessionInput = z.infer<typeof exerciseSessionSchema>
