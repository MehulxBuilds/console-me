import { kafka, TOPICS, getProducer } from "@repo/kafka";
import { client } from "@repo/db";
import { getNotificationCache, NotificationCache } from "@repo/cache";
import type { Consumer, EachBatchPayload, NotificationType } from "@repo/kafka";

export interface NotificationMessage {
    id: string;
    topic?: string;
    message?: string;
    notifyLink?: string;
    type: NotificationType;
    userId: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class NotificationConsumer {
    private consumer: Consumer;
    private isRunning = false;

    constructor() {
        this.consumer = kafka.consumer({
            groupId: "notification-processor", // separate consumer group
        });
    }

    async start() {
        if (this.isRunning) return;

        try {
            await this.consumer.connect();
            console.log("Kafka Notification Consumer: Connected and listening...");

            await this.consumer.subscribe({
                topics: [TOPICS.NOTIFICATION],
                fromBeginning: false,
            });

            await this.consumer.run({
                eachBatchAutoResolve: false,
                eachBatch: async ({
                    batch,
                    resolveOffset,
                    heartbeat,
                    isRunning,
                }: EachBatchPayload) => {
                    const messages = batch.messages;
                    const batchSize = 500;
                    const flushInterval = 10000;

                    console.log(
                        `PostConsumer received ${messages.length} messages from Kafka`,
                    );

                    let currentBatch: (NotificationMessage & { offset: string })[] = [];
                    let lastFlush = Date.now();

                    for (const message of messages) {
                        if (!isRunning()) break;

                        try {
                            const rawValue = message.value?.toString();
                            if (!rawValue) continue;

                            const content = JSON.parse(rawValue) as NotificationMessage;
                            currentBatch.push({
                                ...content,
                                offset: message.offset,
                            });

                            const now = Date.now();
                            if (
                                currentBatch.length >= batchSize ||
                                now - lastFlush >= flushInterval
                            ) {
                                await this.processBatchItems(currentBatch);
                                const lastMsg = currentBatch[currentBatch.length - 1];
                                if (lastMsg) {
                                    resolveOffset(lastMsg.offset);
                                }
                                await heartbeat();
                                currentBatch = [];
                                lastFlush = Date.now();
                            }
                        } catch (error) {
                            console.error(
                                "Error parsing/buffering post message:",
                                error,
                            );
                            resolveOffset(message.offset);
                        }
                    }

                    if (currentBatch.length > 0) {
                        await this.processBatchItems(currentBatch);
                        const lastMsg = currentBatch[currentBatch.length - 1];
                        if (lastMsg) {
                            resolveOffset(lastMsg.offset);
                        }
                        await heartbeat();
                    }
                },
            });

            this.isRunning = true;
        } catch (error) {
            console.error("Failed to start post consumer:", error);
            throw error;
        }
    }

    async stop() {
        if (this.isRunning) {
            await this.consumer.disconnect();
            this.isRunning = false;
            console.log("Kafka PostConsumer: Stopped successfully");
        }
    }

    private async processBatchItems(
        messages: (NotificationMessage & { offset: string })[],
    ) {
        if (messages.length === 0) return;

        console.log(`⚡ PostConsumer processing batch of ${messages.length} items...`);
        const startTime = Date.now();

        const posts = messages.map((msg) => ({
            id: msg.id,
            topic: msg.topic,
            message: msg.message,
            notifyLink: msg.notifyLink,
            type: msg.type,
            userId: msg.userId,
            isRead: msg.isRead,
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt,
        }));

        try {
            await client.notification.createMany({
                data: posts,
                skipDuplicates: true,
            });

            const duration = Date.now() - startTime;
            console.log(`✅ Post batch persisted: ${posts.length} posts (${duration}ms)`);

            const NotificationCache = getNotificationCache();
            const invalidatedKeys = new Set<string>();

            for (const msg of posts) {
                // Invalidate the "initial" page (latest messages)
                const key = `notification:${msg.userId}:initial`;
                
                if (!invalidatedKeys.has(key)) {
                    await NotificationCache.invalidateNotification(key);
                    invalidatedKeys.add(key);
                }
            }

        } catch (e) {
            console.error(
                "❌ Post database batch write failed. Initiating recovery...",
                e,
            );

            const producer = getProducer();
            try {
                for (const msg of messages) {
                    const originalMessage = { ...msg };
                    // @ts-expect-error - remove offset before re-publishing
                    delete originalMessage.offset;
                    await producer.publishNotification(originalMessage);
                }
                console.log(
                    `🔄 Post recovery: Re-queued ${messages.length} messages to Kafka topic.`,
                );
            } catch (produceError) {
                console.error(
                    "🔥 CRITICAL: Failed to re-queue post messages! Data loss possible.",
                    produceError,
                );
            }
        }
    }

    async getLag(): Promise<number> {
        const admin = kafka.admin();
        try {
            await admin.connect();
            let totalLag = 0;
            const groupOffsets = await admin.fetchOffsets({
                groupId: "post-processor",
                topics: [TOPICS.POST],
            });

            for (const topicOffset of groupOffsets) {
                const topicOffsets = await admin.fetchTopicOffsets(
                    topicOffset.topic,
                );

                for (const partition of topicOffset.partitions) {
                    const consumerOffset = partition.offset
                        ? parseInt(partition.offset)
                        : 0;
                    const topicPartition = topicOffsets.find(
                        (tp: {
                            partition: number;
                            high: string;
                            low: string;
                        }) => tp.partition === partition.partition,
                    );
                    const highWatermark = topicPartition?.high
                        ? parseInt(topicPartition.high)
                        : 0;
                    totalLag += highWatermark - consumerOffset;
                }
            }
            return totalLag;
        } finally {
            await admin.disconnect();
        }
    }
}

let NotificationConsumerInstance: NotificationConsumer | null = null;
export function getNotificationConsumer(): NotificationConsumer {
    if (!NotificationConsumerInstance) {
        NotificationConsumerInstance = new NotificationConsumer();
    }
    return NotificationConsumerInstance;
}