import { z } from "zod";

const env = z.object({
	BOT_NAME: z.string(),
	BOT_PASS: z.string(),
	NODE_ENV: z.string().optional(),
	CHANNEL_NAME: z.string(),
	MONGO_URL: z.string(),
});

export default env.parse(process.env);
