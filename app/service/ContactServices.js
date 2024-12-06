import EmailSend from "../utility/emailUtility.js";

//contact mail send service
export const contactMailSendService = async (req) => {
    try {
        let { name, email, subject, message } = req.body;
    
        if(!name) {
            return { status: "error", message: "The name is required!" };
        }
    
        if(!email) {
            return { status: "error", message: "The email is required!" };
        }

        if(!subject) {
            return { status: "error", message: "The subject is required!" };
        }

        if(!message) {
            return { status: "error", message: "The message is required!" };
        }
        
        // Send email using EmailSend function
        let sendEmail = await EmailSend(name, email, subject, message);

        return { status: "success", message: "Email sent successfully.", data: sendEmail };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
}