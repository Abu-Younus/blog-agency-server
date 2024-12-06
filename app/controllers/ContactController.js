import { contactMailSendService } from "../service/ContactServices.js"

//controller for contact mail send
export const ContactMailSend=async(req,res)=>{
    let result=await contactMailSendService(req)
    return res.json(result)
}