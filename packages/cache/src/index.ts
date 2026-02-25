export * from "./redis";
export * from "./post-cache";
export * from "./dm-message-cache";
export * from "./notification-cache";

import { PostCache } from "./post-cache";
import { DMChatCache } from "./dm-message-cache"
import { NotificationCache } from "./notification-cache";

let postCacheInstance: PostCache | null = null;
let dmChatInstance: DMChatCache | null = null;
let NotificationCacheInstance: NotificationCache | null = null;

export function getPostCache(): PostCache {
    if (!postCacheInstance) {
        postCacheInstance = new PostCache();
    }
    return postCacheInstance;
}

export function geDMChatCache(): DMChatCache {
    if (!dmChatInstance) {
        dmChatInstance = new DMChatCache();
    }
    return dmChatInstance;
}

export function getNotificationCache(): NotificationCache {
    if (!NotificationCacheInstance) {
        NotificationCacheInstance = new NotificationCache();
    }
    return NotificationCacheInstance;
}