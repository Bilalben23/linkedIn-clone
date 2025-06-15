import { sendEmail } from "./sendEmail.mjs"

export const sendWelcomeEmail = async (to, name, profileUrl) => {
    return await sendEmail(
        to,
        "Welcome to LinkedIn Clone",
        "welcome",
        { name, profileUrl }
    )
}