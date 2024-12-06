import usersModel from "../model/usersModel.js";
import bcrypt from "bcrypt";
import { EncodeToken } from "../utility/tokenUtility.js";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//registration service
export const registrationService = async (req) => {
    try{
        let {fullName, email, password, role} = req.body;

        // Check if fullName is provided
        if (!fullName) {
            return { status: "error", message: "The full name is required!" };
        }

        // Validate email format using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return { status: "error", message: "The email is required!" };
        }
        if (!emailRegex.test(email)) {
            return { status: "error", message: "Invalid email format!" };
        }

        // Password validation: Minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!password) {
            return { status: "error", message: "The password is required!" };
        }
        if (!passwordRegex.test(password)) {
            return { 
                status: "error", 
                message: "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character!" 
            };
        }

        // Check if the email is already taken
        const existingUser = await usersModel.findOne({email})
        if (existingUser) {
            return { status: "error", message: "Email is already taken!" };
        }

        //hash password
        password = await bcrypt.hash(password, 10);

        // Create user with hashed password
        let newUser ={fullName, email, password, role: role || 'user'};

        let data = await usersModel.create(newUser);
        return { status: "success", message: "Registration successfully.", data: data };

    } catch (error) {
        return { status: "error", error: error.toString() };
    }
}

//login service
export const loginService = async (req, res) => {
    try {
        let { email, password } = req.body;

        // Check if all required fields are provided
        if (!email) {
            return { status: "error", message: "The email is required!" };
        }

        if (!password) {
            return { status: "error", message: "The password is required!" };
        }

        // Find the student by email
        let user = await usersModel.findOne({ email });

        // If no user is found
        if (!user) {
            return { status: "error", message: "User not found!" };
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { status: "error", message: "Invalid email or password!" };
        }

        // If the password is valid, generate a JWT token
        let token = EncodeToken(user.email, user.role);

        // Set the cookie with JWT token
        let options = {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: true,
            sameSite: "none",
            secure: true
        };

        res.cookie("Token", token, options);

        // Return success response with token and student data
        return { status: "success", token: token, data: { _id: user._id, name:user.fullName, email: user.email } };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
}

// Profile read service
export const profileReadService = async (req) => {
    let userID = req.headers.userID;

    try {
        // Find the user profile by userID
        const user = await usersModel.findById(userID).select("fullName email img role createdAt updatedAt");

        if (!user) {
            return { status: "error", message: "Profile not found" };
        }

        return { 
            status: "success", 
            data: {
                fullName: user.fullName,
                email: user.email,
                img: user.img ? `${BASE_URL}/${user.img}` : null,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            } 
        };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

// Profile update service
export const profileUpdateService = async (req) => {
    const userID = req.headers.userID;

    try {
        const updateData = req.body;

        // Check if an image file is uploaded
        if (req.file) {
            const user = await usersModel.findById(userID);
            if (user && user.img) {
                // Delete the old image file
                const oldImagePath = path.resolve(__dirname, "../../", user.img);
                try {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                        console.log("Deleted old image:", imagePath);
                    } else {
                        console.error("Image not found:", imagePath);
                    }
                } catch (error) {
                    console.error("Error deleting image:", error.message);
                }
            }

            // Set the new image path
            updateData.img = `storage/images/${req.file.filename}`;
        }

        const updatedUser = await usersModel.findByIdAndUpdate(
            userID,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return { status: "error", message: "Profile not found or failed to update" };
        }

        return {
            status: "success",
            data: {
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                img: updatedUser.img ? `${BASE_URL}/${updatedUser.img}` : null,
                role: updatedUser.role,
                updatedAt: updatedUser.updatedAt,
            }
        };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

//logout service
export const logOutService = async (res) => {
    try {
        res.clearCookie('Token');
        return { status: "success" };
    } catch (e) {
        return { status: "error", error: e.toString() };
    }
}