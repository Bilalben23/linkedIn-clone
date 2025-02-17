import { MailtrapClient } from "mailtrap";
import { ENV_VARS } from "./enVars.mjs";

export const mailtrapClient = new MailtrapClient({
    token: ENV_VARS.MAILTRAP_TOKEN
});

export const sender = {
    email: ENV_VARS.MAILTRAP_SENDER_EMAIL,
    name: ENV_VARS.MAILTRAP_SENDER_NAME
}

