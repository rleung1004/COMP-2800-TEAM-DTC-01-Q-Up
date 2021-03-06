import * as nodeMailer from "nodemailer";

/**
 * Creates a transport object that is to be used to send emails.
 */
const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'teamkart.bcit@gmail.com',
        pass: 'Y7u8I9o0_'
    }
});

/**
 * Creates a message object to be put inside the email notification.
 *
 * @param destinationEmail      a string
 * @return Object               a message object used in the email notifications
 */
const message = (destinationEmail: string) => {
    return {
        from: 'teamkart.bcit@gmail.com',
        to: destinationEmail,
        subject: 'Q-UP Notifications',
        text:
            `Hi there, I hope everything is going well in these hard times.
            
        This is a friendly reminder that your queue position will be checked in by the time you get to your queued store.
        
        Sincerely,
        Q-UP auto generated notification
        `,
    }
};

/**
 * Sends an email to the destination email.
 *
 * @param destinationEmail      a string.
 * @return Object               an error message or the information about the sentMail
 */
export const sendMail = async (destinationEmail: string) => {
    return transporter.sendMail(message(destinationEmail), (error: any, info: any) => {
        if (error) {
            console.error(error);
            return false;
        }
        return {
            sent: true,
            messageId: info.messageId,
            accepted: info.accepted,
            response: info.response,
        };
    });
};
