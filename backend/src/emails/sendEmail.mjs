import ejs from "ejs";
import { sender, mailtrapClient } from "../configs/mailtrap.mjs";
import { resolve } from "path";

export const sendEmail = async (to, subject, templateName, data) => {
    try {
        // render EJS template
        const templatePath = resolve("backend", "emails", "templates", `${templateName}.ejs`)
        const htmlContent = await ejs.renderFile(templatePath, data);

        await mailtrapClient.send({
            from: sender,
            to: [{ email: to }],
            subject,
            html: htmlContent
        })

        console.log(`Email sent successfully to ${to}`);
        return {
            success: true,
            message: "Email sent successfully"
        }
    } catch (err) {
        console.error("Error sending email: ", err.message)
        return {
            success: false,
            message: "Failed to send email"
        }
    }
}