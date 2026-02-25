import { kafka, TOPICS, getProducer } from "@repo/kafka";
import { client } from "@repo/db";
import { DMChatCache } from "@repo/cache";
import type { Consumer, EachBatchPayload } from "@repo/kafka";

export interface DMChatMessage {
    id: string
}

export class DMConsumer {
    private consumer: Consumer;
    private isRunning = false;

    constructor() {
        this.consumer = kafka.consumer({
            groupId: "dm-processor", // separate consumer group
        });
    }

    async start() {
        if (this.isRunning) return;

        try {
            await this.consumer.connect();
            console.log("Kafka Dm-Chat Consumer: Connected and listening...");

            await this.consumer.subscribe({
                topics: [TOPICS.DM_MESSAGES],
                fromBeginning: false,
            });
        } catch (e) {
            console.error(e);
        }
    }
}

let DMConsumerInstance: DMConsumer | null = null;
export function getDMConsumer(): DMConsumer {
    if (!DMConsumerInstance) {
        DMConsumerInstance = new DMConsumer();
    }
    return DMConsumerInstance;
}