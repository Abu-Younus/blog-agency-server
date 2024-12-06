import { JWT_EXPIRE_TIME, JWT_KEY } from "../config/config.js";
import jwt from "jsonwebtoken"

//Encode token
export const EncodeToken = (email, role) => {
    let key = JWT_KEY;
    let expire = JWT_EXPIRE_TIME;
    let payload = { email, role };
    return jwt.sign(payload, key, { expiresIn: expire });
};

//Decode token
export const DecodeToken = (token) => {
    try {
        let key = JWT_KEY;
        let expire = JWT_EXPIRE_TIME;
        let decoded = jwt.verify(token, key);

        // Refresh token add
        if (!!decoded.email === true) {
            let RefreshToken = jwt.sign({ email: decoded.email, role: decoded.role}, key, { expiresIn: expire })
            return { RefreshToken, email: decoded.email, role: decoded.role };
        }
    } catch (err) {
        return null;
    }
};