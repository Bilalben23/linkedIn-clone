import { MailtrapClient } from "mailtrap";
import { configDotenv } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
configDotenv({ path: resolve(__dirname, "../../.env") });


const TOKEN = process.env.MAILTRAP_TOKEN;
const SENDER_EMAIL = process.env.MAILTRAP_SENDER_EMAIL
const SENDER_NAME = process.env.MAILTRAP_SENDER_NAME || "LinkedIn Clone";

export const mailtrapClient = new MailtrapClient({ token: TOKEN });

export const sender = {
    email: SENDER_EMAIL,
    name: SENDER_NAME
}

