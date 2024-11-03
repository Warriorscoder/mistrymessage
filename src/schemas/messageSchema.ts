import z from 'zod'

export const messageSchema = z.object({
    content: z
    .string()
    .min(10,'message should be atleast of 10 characters ')
    .max(300,'message should be atmost of 300 characters ')
})