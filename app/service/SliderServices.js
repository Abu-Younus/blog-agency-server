import sliderModel from "../model/sliderModel.js";
import { BASE_URL } from "../config/config.js";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//slider create service
export const createSliderService = async (req) => {
    try {
        let {title, description} = req.body
    
        if(!title) {
            return { status: "error", message: "The title is required!" };
        }
    
        if(!description) {
            return { status: "error", message: "The description is required!" };
        }
        
        // Check if the slider title already exists
        const existingSlider = await sliderModel.findOne({ title });
        if (existingSlider) {
            return { status: "error", message: "Slider title is already taken!" };
        }

        // Prepare the slider data to save
        let sliderData = {
            title,
            description,
        };

        // If an image was uploaded, save the path
        if (req.file) {
            sliderData.img = `storage/images/${req.file.filename}`;
        }

        // Save the sliderData to the database
        let data = await sliderModel.create(sliderData);
        return { status: "success", message: "Slider create successfully.", data: data };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
}

//get all sliders service
export const getAllSlidersService = async () => {
    try {
        // Fetch all sliders
        const sliders = await sliderModel.find().select("title description img createdAt updatedAt");

        // Map over sliders to add the base URL to image paths
        const slidersData = sliders.map(slider => {
            let sliderImageUrl = slider.img ? `${BASE_URL}/${slider.img}` : null;

            return {
                title: slider.title,
                description: slider.description,
                img: sliderImageUrl,
                createdAt: slider.createdAt,
                updatedAt: slider.updatedAt
            };
        });

        return { status: "success", message: "Sliders fetched successfully.", data: slidersData };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

//get latest sliders service
export const getLatestSlidersService = async () => {
    try {
        // Fetch the latest 4 sliders sorted by createdAt in descending order
        const sliders = await sliderModel
            .find()
            .sort({ createdAt: -1 })
            .limit(4)
            .select("title description img createdAt updatedAt");

        // Map over sliders to add the base URL to image paths
        const slidersData = sliders.map(slider => {
            let sliderImageUrl = slider.img ? `${BASE_URL}/${slider.img}` : null;

            return {
                title: slider.title,
                description: slider.description,
                img: sliderImageUrl,
                createdAt: slider.createdAt,
                updatedAt: slider.updatedAt
            };
        });

        return { status: "success", message: "Latest sliders fetched successfully.", data: slidersData };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

//get slider by id service
export const getSliderByIdService = async (req) => {
    try {
        const { id } = req.params;
        
        // Find slider by ID
        const slider = await sliderModel.findById(id)

        if (!slider) {
            return { status: "error", message: "Slider not found!" };
        }

        // Extract image name and set full image URL
        let sliderImageUrl = slider.img ? `${BASE_URL}/${slider.img}` : null;

        const sliderData = {
            title: slider.title,
            description: slider.description,
            img: sliderImageUrl,
            createdAt: slider.createdAt,
            updatedAt: slider.updatedAt
        };

        return { status: "success", message: "Single slider fetched successfully.", data: sliderData };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

//update slider service
export const updateSliderService = async (req) => {
    try {
        const { id } = req.params;
        let {title, description} = req.body
    
        if(!title) {
            return { status: "error", message: "The title is required!" };
        }
    
        if(!description) {
            return { status: "error", message: "The description is required!" };
        }

        let slider = await sliderModel.findById(id);
        if (!slider) {
            return { status: "error", message: "Slider not found!" };
        }

        // Update fields
        slider.title = title;
        slider.description = description;

        // Handle image update
        if (req.file) {
            // Remove the old image if it exists
            if (slider.img) {
                const oldImagePath = path.resolve(__dirname, "../../", slider.img);
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
            slider.img = `storage/images/${req.file.filename}`;
        }

        await slider.save();
        return { status: "success", message: "Slider updated successfully.", data: slider };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

//delete slider service
export const deleteSliderService = async (req) => {
    try {
        const { id } = req.params;

        const slider = await sliderModel.findById(id);
        if (!slider) {
            return { status: "error", message: "Slider not found!" };
        }

        // Remove the image from the file system
        if (slider.img) {
            const imagePath = path.resolve(__dirname, "../../", slider.img);
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

        // Delete the slider
        await sliderModel.findByIdAndDelete(id);

        return { status: "success", message: "Slider deleted successfully." };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};