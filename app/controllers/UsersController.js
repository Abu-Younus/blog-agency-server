import { loginService, logOutService, profileReadService, profileUpdateService, registrationService } from './../service/UserServices.js';

//registration controller
export const Registration = async (req, res) => {
    let result = await registrationService(req)
    return res.json(result);
}

//login controller
export const Login = async (req, res) => {
    let result = await loginService(req, res)
    return res.json(result);
}

//profile read controller
export const ProfileRead = async (req, res) => {
    let result = await profileReadService(req)
    return res.json(result);
}

//profile update controller
export const ProfileUpdate = async (req, res) => {
    let result = await profileUpdateService(req)
    return res.json(result);
}

//logout controller
export const Logout = async (req, res) => {
    let result = await logOutService(res)
    return res.json(result);
}