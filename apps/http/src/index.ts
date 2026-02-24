import express from "express";
import cookieParser from "cookie-parser";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from "cors";
import { auth } from "@repo/auth";
import { redis } from "@repo/cache";
import { client } from "@repo/db";
import { env } from "./config/env";
import postRoutes from "./routes/post-routes";
import creatorRoutes from "./routes/creator-routes";
import userRoutes from "./routes/user-routes";

const app = express();

app.use(cors({
    origin: [env.WEB_APP_URL!],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/api/me", async (req, res) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    return res.json(session);
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use('/api/v1/creator', creatorRoutes);

app.get("/", async (req, res) => {
    await redis.set("greeting", "Hello from Redis!");
    console.log(await redis.get("greeting"))
    await redis.del("greeting");
    res.send("Hello World!");
});

app.listen(5000, async () => {
    await client.$connect();
    console.log("Database connected successfully");
    console.log("Server is running on port 5000");
});