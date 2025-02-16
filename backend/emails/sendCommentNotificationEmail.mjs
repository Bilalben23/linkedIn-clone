import { sendEmail } from "./sendEmail.mjs"


export const sendCommentNotificationEmail = async (to, recipientName, commenterName, postUrl) => {
    return await sendEmail(
        to,
        `${commenterName} commented on your post!`,
        "commentNotification",
        { recipientName, commenterName, postUrl }
    )
}




