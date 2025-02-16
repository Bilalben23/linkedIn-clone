import { sendEmail } from "./sendEmail.mjs"


export const sendConnectionAcceptedEmail = async (to, senderName, recipientName, profileUrl) => {
    return await sendEmail(
        to,
        `${senderName} has accepted your connection request!`,
        "connectionAccepted",
        { senderName, recipientName, profileUrl }
    )
}