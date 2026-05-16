import { web_env as env } from "@/lib/env";

export const API_BASE = env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5000";
