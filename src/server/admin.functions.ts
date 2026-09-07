import { createServerFn } from '@tanstack/react-start'
import { desc } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { surveyResponses } from '../../db/schema.js'
import { requireAdminMiddleware } from '../middleware/identity.js'

export const getAllResponses = createServerFn({ method: 'GET' })
  .middleware([requireAdminMiddleware])
  .handler(async () => {
    const rows = await db.select().from(surveyResponses).orderBy(desc(surveyResponses.createdAt))
    return rows
  })
