import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

export const env = {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
};