import express from "express";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from "cors";
import { client } from "@repo/db";
import { server_env as env } from "@repo/env";
import postRoutes from "./routes/post-routes";
import creatorRoutes from "./routes/creator-routes";
import userRoutes from "./routes/user-routes";
import notificationRoutes from "./routes/notification-routes";
import subscriptionRoutes from "./routes/subscription-routes";
import messageRoutes from "./routes/message-routes";
import likeRoutes from "./routes/like-routes";
import followRoutes from "./routes/follow-routes";
import omegleRoutes from "./routes/omegle-routes";
import friendRoutes from "./routes/friend-routes";
import { auth } from "./config/auth";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [env.WEB_URL,].filter(
    (origin): origin is string => Boolean(origin),
);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    }),
);

app.all('/api/auth/*splat', toNodeHandler(auth))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/api/me", async (req, res) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
        return res.json(null);
    }

    const user = await client.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            email: true,
            name: true,
            image: true,
            bio: true,
            role: true,
            createdAt: true,
            creatorProfile: {
                select: {
                    id: true,
                    username: true,
                },
            },
        },
    });

    if (!user) {
        return res.json(null);
    }

    return res.json({
        ...session,
        user: {
            ...session.user,
            ...user,
            creatorId: user.creatorProfile?.id ?? null,
            username: user.creatorProfile?.username ?? null,
            creatorProfile: undefined,
        },
    });
});

app.get('/health', (_req, res) => {
    res.send("All Good!")
})

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use('/api/v1/creator', creatorRoutes);
app.use('/api/v1/notification', notificationRoutes);
app.use('/api/v1/subscription', subscriptionRoutes);
app.use('/api/v1/message', messageRoutes);
app.use('/api/v1/like', likeRoutes);
app.use('/api/v1/follow', followRoutes);
app.use('/api/v1/omegle', omegleRoutes);
app.use('/api/v1/friends', friendRoutes);

app.listen(5000, async () => {
    await client.$connect();
    console.log("Database connected successfully");
    console.log("Server is running on port 5000");
    console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);
});
