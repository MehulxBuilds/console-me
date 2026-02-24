import { MediaType } from "@repo/db/values";
import { z } from "zod/v4";

export const UsernameType = z.object({
    username: z.string("Not a valid string").min(2).max(10),
})

export const CreatorProfileUpdate = z.object({
    username: z.string("Not a valid string").min(2).max(10),
    subscriptionPrice: z.number("Not a valid number"),
    payoutEmail: z.email("Not a valid Email"),
})

export const UserProfileUpdate = z.object({
    name: z.string("Not a valid string").min(2).max(50),
    image: z.string("Not a valid string").min(2).max(50).optional(),
    bio: z.string("Not a valid string").min(2).max(500).optional(),
    banner: z.string("Not a valid string").optional(),
})

export const CreatorPostType = z.object({
    caption: z.string("Not a valid string").min(2).max(50),
    isLocked: z.boolean("Not a valid string").optional(),
    price: z.number("Not a valid Number").optional(),
    media_type: z.nativeEnum(MediaType),
    media_url: z.string("Not a valid string"),
})