import { kafka, TOPICS } from "./client";
import type { Producer } from "kafkajs";

export const NotificationType = {
    NEW_SUBSCRIBER: "NEW_SUBSCRIBER",
    NEW_TIP: "NEW_TIP",
    NEW_MESSAGE: "NEW_MESSAGE",
    NEW_COMMENT: "NEW_COMMENT",
    SUBSCRIPTION_EXPIRED: "SUBSCRIPTION_EXPIRED",
} as const;

export type NotificationType =
    (typeof NotificationType)[keyof typeof NotificationType];

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

export interface PostMessage {
    id: string,
    creatorId: string,
    caption?: string,
    isLocked: boolean,
    price?: Number,
    createdAt: Date;
    updatedAt: Date;
    media_url: string;
    media_type: string;
}

export interface DMChatMessage {
    id: string
}

export interface AccountcheckReport {
    id: string,
    userId: string,
    isAccReport: boolean,
    accReportReason: string,
}

export class MessageProducer {
    private producer: Producer;
    private isConnected = false;

    constructor() {
        this.producer = kafka.producer();
    }

    async connect() {
        if (!this.isConnected) {
            await this.producer.connect();
            this.isConnected = true;
        }
    }

    async disconnect() {
        if (this.isConnected) {
            await this.producer.disconnect();
            this.isConnected = false;
        }
    }

    async publishNotification(message: NotificationMessage): Promise<string> {
        await this.connect();

        const topic = TOPICS.NOTIFICATION;
        const partitionKey = message.id;

        try {
            await this.producer.send({
                topic,
                messages: [
                    {
                        key: partitionKey,
                        value: JSON.stringify(message),
                    },
                ],
            });

            return message.id;
        } catch (error) {
            console.error("Failed to publish message:", error);
            throw error;
        }
    }

    async publishDMChatMessage(message: DMChatMessage): Promise<string> {
        await this.connect();

        const topic = TOPICS.DM_MESSAGES;
        const partitionKey = message.id;

        try {
            await this.producer.send({
                topic,
                messages: [
                    {
                        key: partitionKey,
                        value: JSON.stringify(message),
                    },
                ],
            });

            return message.id;
        } catch (error) {
            console.error("Failed to publish message:", error);
            throw error;
        }
    }

    async publishPost(message: PostMessage): Promise<string> {
        await this.connect();

        const topic = TOPICS.POST;
        const partitionKey = message.id;

        try {
            await this.producer.send({
                topic,
                messages: [
                    {
                        key: partitionKey,
                        value: JSON.stringify(message),
                    },
                ],
            });

            return message?.id;
        } catch (error) {
            console.error("Failed to publish message:", error);
            throw error;
        }
    }
    
    async publishAccountCheckReport(message: AccountcheckReport): Promise<string> {
        await this.connect();

        const topic = TOPICS.ACCOUNT_REPORT_CHECK;
        const partitionKey = message.id;

        try {
            await this.producer.send({
                topic,
                messages: [
                    {
                        key: partitionKey,
                        value: JSON.stringify(message),
                    },
                ],
            });

            return message.id;
        } catch (error) {
            console.error("Failed to publish message:", error);
            throw error;
        }
    }
}

// Singleton instance
let producerInstance: MessageProducer | null = null;

export function getProducer(): MessageProducer {
    if (!producerInstance) {
        producerInstance = new MessageProducer();
    }
    return producerInstance;
}