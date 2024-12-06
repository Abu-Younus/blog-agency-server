import { DecodeToken } from "../utility/tokenUtility.js";

export default (req, res, next) => {
    let token = req.cookies["Token"];
    let decoded = DecodeToken(token);

    if (decoded === null) {
        res.status(401).json({ status: "fail", message: "Unauthorized" });
    } else {
        // Set cookie for refresh token
        let options = {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: true,
            sameSite: "none",
            secure: true,
        };
        res.cookie("Token", decoded.RefreshToken, options);

        req.headers.email = decoded.email;
        req.headers.role = decoded.role;
        next();
    }
};

export const roleAuthorization = (roles) => {
    return (req, res, next) => {
        const userRole = req.headers.role;
        if (!roles.includes(userRole)) {
            return res.status(403).json({ status: "fail", message: "Access denied." });
        }
        next();
    };
};