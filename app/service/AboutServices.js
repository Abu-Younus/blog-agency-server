import aboutModel from "../model/aboutModel.js";
import { BASE_URL } from "../config/config.js";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//about create service
export const createAboutService = async (req) => {
    try {
        let {description} = req.body
    
        if(!description) {
            return { status: "error", message: "The description is required!" };
        }

        // Prepare the about data to save
        let aboutData = {
            description,
        };

        // If an image was uploaded, save the path
        if (req.file) {
            aboutData.img = `storage/images/${req.file.filename}`;
        }

        // Save the aboutData to the database
        let data = await aboutModel.create(aboutData);
        return { status: "success", message: "About create successfully.", data: data };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
}

//get all about service
export const getAllAboutService = async () => {
    try {
        // Fetch all about
        const about = await aboutModel.find().select("description img createdAt updatedAt");

        // Map over about to add the base URL to image paths
        const aboutData = about.map(ab => {
            let aboutImageUrl = ab.img ? `${BASE_URL}/${ab.img}` : null;

            return {
                description: ab.description,
                img: aboutImageUrl,
                createdAt: ab.createdAt,
                updatedAt: ab.updatedAt
            };
        });

        return { status: "success", message: "About fetched successfully.", data: aboutData };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

//fetch the latest about record
export const getLatestAboutService = async () => {
    try {
        // Fetch the latest about record sorted by createdAt in descending order
        const about = await aboutModel
            .find()
            .sort({ createdAt: -1 })
            .limit(1)
            .select("description img createdAt updatedAt");

        // Map over the result to format the data
        const aboutData = about.map(ab => {
            let aboutImageUrl = ab.img ? `${BASE_URL}/${ab.img}` : null;

            return {
                description: ab.description,
                img: aboutImageUrl,
                createdAt: ab.createdAt,
                updatedAt: ab.updatedAt
            };
        });

        return { 
            status: "success", 
            message: "Latest about fetched successfully.", 
            data: aboutData[0] || null
        };
    } catch (error) {
        return { 
            status: "error", 
            error: error.toString() 
        };
    }
};

//get about by id service
export const getAboutByIdService = async (req) => {
    try {
        const { id } = req.params;
        
        // Find about by ID
        const about = await aboutModel.findById(id)

        if (!about) {
            return { status: "error", message: "About not found!" };
        }

        // Extract image name and set full image URL
        let aboutImageUrl = about.img ? `${BASE_URL}/${about.img}` : null;

        const aboutData = {
            description: about.description,
            img: aboutImageUrl,
            createdAt: about.createdAt,
            updatedAt: about.updatedAt
        };

        return { status: "success", message: "Single about fetched successfully.", data: aboutData };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

//update about service
export const updateAboutService = async (req) => {
    try {
        const { id } = req.params;
        let {description} = req.body
    
        if(!description) {
            return { status: "error", message: "The description is required!" };
        }

        let about = await aboutModel.findById(id);
        if (!about) {
            return { status: "error", message: "About not found!" };
        }

        // Update fields
        about.description = description;

        // Handle image update
        if (req.file) {
            // Remove the old image if it exists
            if (about.img) {
                const oldImagePath = path.resolve(__dirname, "../../", about.img);
                try {
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                        console.log("Deleted old image:", oldImagePath);
                    } else {
                        console.error("Old image not found:", oldImagePath);
                    }
                } catch (error) {
                    console.error("Error deleting old image:", error.message);
                }
            }
        
            // Save the new image path
            about.img = `storage/images/${req.file.filename}`;
        }  

        await about.save();
        return { status: "success", message: "About updated successfully.", data: about };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

//delete about service
export const deleteAboutService = async (req) => {
    try {
        const { id } = req.params;

        const about = await aboutModel.findById(id);
        if (!about) {
            return { status: "error", message: "About not found!" };
        }

        // Remove the image from the file system
        if (about.img) {
            const imagePath = path.resolve(__dirname, "../../", about.img);
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

        // Delete the about
        await aboutModel.findByIdAndDelete(id);

        return { status: "success", message: "About deleted successfully." };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};