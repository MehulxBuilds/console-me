import { kafka, TOPICS, getProducer } from "@repo/kafka";
import { client } from "@repo/db";
import type { Consumer, EachBatchPayload } from "@repo/kafka";

export interface AccountcheckReport {
    id: string,
    userId: string,
    isAccReport: boolean,
    accReportReason: string,
}

export class AccountCheckConsumer {
    private consumer: Consumer;
    private isRunning = false;

    constructor() {
        this.consumer = kafka.consumer({
            groupId: "account-check-processor", // separate consumer group
        });
    }

    async start() {
        if (this.isRunning) return;

        try {
            await this.consumer.connect();
            console.log("Kafka Account Check consumer: Connected and listening...");

            await this.consumer.subscribe({
                topics: [TOPICS.ACCOUNT_REPORT_CHECK],
                fromBeginning: false,
            });
        } catch (e) {
            console.error(e);
        }
    }
}

let AccountCheckConsumerInstance: AccountCheckConsumer | null = null;
export function getAccountCheckConsumer(): AccountCheckConsumer {
    if (!AccountCheckConsumerInstance) {
        AccountCheckConsumerInstance = new AccountCheckConsumer();
    }
    return AccountCheckConsumerInstance;
}