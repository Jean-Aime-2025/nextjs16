import { Id } from '@/convex/_generated/dataModel'
import z from 'zod'

export const commentSchema = z.object({
    body: z.string().min(1).max(1000, "Comment body cannot exceed 1000 characters"),
    postId:z.custom<Id<"posts">>(),
})