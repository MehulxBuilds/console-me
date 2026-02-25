import { Kafka, logLevel } from "kafkajs";

export const kafka = new Kafka({
    clientId: "console-me",
    brokers: (process.env.KAFKA_BROKER || "localhost:9092").split(","),
    logLevel: logLevel.ERROR,
    retry: {
        initialRetryTime: 100,
        retries: 8,
    },
});

// Kafka Topics
export const TOPICS = {
    POST: "app-post",
    DM_MESSAGES: "dm-messages",
    NOTIFICATION: "notification",
    ACCOUNT_REPORT_CHECK: "account-report-check"
} as const;

// Topic configurations
export const TOPIC_CONFIGS = {
    [TOPICS.POST]: {
        numPartitions: 1,
        replicationFactor: 1,
    },
    [TOPICS.DM_MESSAGES]: {
        numPartitions: 1,
        replicationFactor: 1,
    },
    [TOPICS.NOTIFICATION]: {
        numPartitions: 1,
        replicationFactor: 1,
    },
    [TOPICS.ACCOUNT_REPORT_CHECK]: {
        numPartitions: 1,
        replicationFactor: 1,
    },
};