import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { OAuth2Client } from "google-auth-library";
import { client } from "@repo/db";
import { server_env as env } from "@repo/env";
import { AUTH_COOKIE_NAME, clearAuthCookie, setAuthCookie, signAuthToken } from "../utils/jwt-auth.js";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
    const { credential } = req.body as { credential?: string };

    if (!credential) {
        return res.status(400).json({ success: false, message: "Google credential is required" });
    }

    const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email?.toLowerCase();

    if (!payload?.sub || !email) {
        return res.status(401).json({ success: false, message: "Invalid Google account" });
    }

    const user = await client.user.upsert({
        where: { email },
        update: {
            name: payload.name ?? email,
            image: payload.picture,
            emailVerified: payload.email_verified ?? true,
        },
        create: {
            id: randomUUID(),
            name: payload.name ?? email,
            email,
            emailVerified: payload.email_verified ?? true,
            image: payload.picture,
        },
        include: {
            creatorProfile: {
                select: {
                    id: true,
                    username: true,
                },
            },
        },
    });

    const token = signAuthToken({ userId: user.id, email: user.email });
    await client.session.create({
        data: {
            id: randomUUID(),
            token,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        },
    });

    setAuthCookie(res, token);

    return res.status(200).json({
        success: true,
        data: {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                role: user.role,
                bio: user.bio,
                createdAt: user.createdAt,
                creatorId: user.creatorProfile?.id ?? null,
                username: user.creatorProfile?.username ?? null,
            },
        },
    });
};

export const logout = async (req: Request, res: Response) => {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith("Bearer ")
        ? authorization.slice("Bearer ".length)
        : req.cookies?.[AUTH_COOKIE_NAME];

    if (token) {
        await client.session.deleteMany({ where: { token } });
    }

    clearAuthCookie(res);
    return res.status(200).json({ success: true });
};
