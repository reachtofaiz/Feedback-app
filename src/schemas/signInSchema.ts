import {z} from 'zod'

export const signInSchema = z.object({
    identifier: z.string(), // identifier is of any thing such as username, email...
    password: z.string()
})