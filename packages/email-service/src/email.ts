import nodemailer from "nodemailer";
import { env } from "./config/env";

interface EmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.USER_APP_EMAIL,
        pass: env.USER_APP_PASS,
    },
});

export async function sendEmail({
    to,
    subject,
    text,
    html,
}: EmailOptions) {
    try {
        const info = await transporter.sendMail({
            from: `"Your App" <${env.USER_APP_EMAIL}>`,
            to,
            subject,
            text,
            html,
        });

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error("Email error:", error);
        return {
            success: false,
            error,
        };
    }
};