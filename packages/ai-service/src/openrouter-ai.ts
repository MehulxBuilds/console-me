import { OpenRouter } from "@openrouter/sdk";
import { server_env as env } from "@repo/env";

const openrouter = new OpenRouter({
    apiKey: env.OPENROUTER_API_KEY
});

export const generateText = async ({ modelId = "arcee-ai/trinity-mini:free", prompt }: { modelId?: string, prompt: string }) => {
    const result = await openrouter.chat.send({
        chatGenerationParams: {
            model: modelId,
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        },
    });

    return result?.choices?.[0]?.message.content as string;
};
