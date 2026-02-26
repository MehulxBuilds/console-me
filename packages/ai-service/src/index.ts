import { env } from "./config/env";

export * from "./gemini-ai";
export * from "./openrouter-ai";

console.log(env.GEMINI_API_KEY)