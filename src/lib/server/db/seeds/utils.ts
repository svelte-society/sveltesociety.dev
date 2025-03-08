import { z } from 'zod'
import * as dotenv from 'dotenv'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const validator = z.object({
	DB_PATH: z.string().regex(/\.db$/).readonly(),
	EVENT_DB_PATH: z.string().regex(/\.db$/).readonly(),
	NODE_ENV: z.string().readonly()
})

export const config = validator.parse(process.env) as z.infer<typeof validator>
