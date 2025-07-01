import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	HOST: z.string().min(1).default("localhost"),
	PORT: z.coerce.number().int().positive().default(3000),
	PROMPT_SECURITY_API_URL: z.string().url(),
	PROMPT_SECURITY_APP_ID: z.string().min(1),
	COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
	COMMON_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(1000),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error("❌ Invalid environment variables:", parsedEnv.error.format());
	throw new Error("Invalid environment variables");
}

export const env = {
	...parsedEnv.data,
	isDevelopment: parsedEnv.data.NODE_ENV === "development",
	isProduction: parsedEnv.data.NODE_ENV === "production",
	isTest: parsedEnv.data.NODE_ENV === "test",
};
