import { MediaType } from "@repo/db/values";
import { z } from "zod/v4";

export const UsernameType = z.object({
    username: z.string("Not a valid string").min(2).max(14),
})

export const CreatorProfileUpdate = z.object({
    username: z.string("Not a valid string").min(2).max(14),
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
    caption: z.string("Not a valid string").max(500).optional(),
    isLocked: z.boolean("Not a valid boolean").optional(),
    price: z.number("Not a valid Number").optional(),
    media_type: z.nativeEnum(MediaType).optional(),
    media_url: z.string("Not a valid string").optional(),
})

export const MarkingNotificationReadType = z.object({
    notificationIds: z.array(
        z.object({
            id: z.string("Not a valid string")
        })
    )
});