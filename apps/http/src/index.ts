import express from "express";
import cookieParser from "cookie-parser";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from "cors";
import { auth } from "@repo/auth";

const app = express();

app.use(cors({
    origin: "http://localhost:3000", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
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

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});