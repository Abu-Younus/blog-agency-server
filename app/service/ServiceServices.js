import servicesModel from "../model/servicesModel.js";
import { createSlug } from "../utility/slugUtility.js";
import { BASE_URL } from "../config/config.js";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//services create service
export const createServicesService = async (req) => {
    try {
        let {title, description} = req.body
    
        if(!title) {
            return { status: "error", message: "The title is required!" };
        }
    
        if(!description) {
            return { status: "error", message: "The description is required!" };
        }
        
        // Check if the services title already exists
        const existingService = await servicesModel.findOne({ title });
        if (existingService) {
            return { status: "error", message: "Service title is already taken!" };
        }

        // Create slug
        const serviceSlug = await createSlug(title);

        // Prepare the services data to save
        let serviceData = {
            title,
            serviceSlug,
            description,
        };

        // If an image was uploaded, save the path
        if (req.file) {
            serviceData.img = `storage/images/${req.file.filename}`;
        }

        // Save the services to the database
        let data = await servicesModel.create(serviceData);
        return { status: "success", message: "Services create successfully.", data: data };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
}

//get all services service
export const getAllServicesService = async () => {
    try {
        // Fetch all services
        const services = await servicesModel.find().select("title slug description img createdAt updatedAt");

        // Map over services to add the base URL to image paths
        const servicesData = services.map(service => {
            let serviceImageUrl = service.img ? `${BASE_URL}/${service.img}` : null;

            return {
                title: service.title,
                slug: service.slug,
                description: service.description,
                img: serviceImageUrl,
                createdAt: service.createdAt,
                updatedAt: service.updatedAt
            };
        });

        return { status: "success", message: "Services fetched successfully.", data: servicesData };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

//get latest services service
export const getLatestServicesService = async () => {
    try {
        // Fetch the latest 3 services sorted by createdAt in descending order
        const services = await servicesModel
            .find()
            .sort({ createdAt: -1 })
            .limit(3)
            .select("title slug description img createdAt updatedAt");

        // Map over services to format the data
        const servicesData = services.map(service => {
            let serviceImageUrl = service.img ? `${BASE_URL}/${service.img}` : null;

            return {
                title: service.title,
                slug: service.slug,
                description: service.description,
                img: serviceImageUrl,
                createdAt: service.createdAt,
                updatedAt: service.updatedAt
            };
        });

        return { 
            status: "success", 
            message: "Latest services fetched successfully.", 
            data: servicesData 
        };
    } catch (error) {
        return { 
            status: "error", 
            error: error.toString() 
        };
    }
};

//get services by id service
export const getServicesByIdService = async (req) => {
    try {
        const { id } = req.params;
        
        // Find services by ID
        const service = await servicesModel.findById(id)

        if (!service) {
            return { status: "error", message: "Service not found!" };
        }

        // Extract image name and set full image URL
        let serviceImageUrl = service.img ? `${BASE_URL}/${service.img}` : null;

        const serviceData = {
            title: service.title,
            slug: service.slug,
            description: service.description,
            img: serviceImageUrl,
            createdAt: service.createdAt,
            updatedAt: service.updatedAt
        };

        return { status: "success", message: "Single service fetched successfully.", data: serviceData };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

//update services service
export const updateServicesService = async (req) => {
    try {
        const { id } = req.params;
        let {title, description} = req.body
    
        if(!title) {
            return { status: "error", message: "The title is required!" };
        }
    
        if(!description) {
            return { status: "error", message: "The description is required!" };
        }

        let service = await servicesModel.findById(id);
        if (!service) {
            return { status: "error", message: "Service not found!" };
        }

        // Create slug
        const serviceSlug = await createSlug(title);

        // Update fields
        service.title = title;
        service.slug = serviceSlug;
        service.description = description;

        // Handle image update
        if (req.file) {
            // Remove the old image if it exists
            if (service.img) {
                const oldImagePath = path.resolve(__dirname, "../../", service.img);
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
            service.img = `storage/images/${req.file.filename}`;
        }

        await service.save();
        return { status: "success", message: "Slider updated successfully.", data: service };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

//delete services service
export const deleteServicesService = async (req) => {
    try {
        const { id } = req.params;

        const service = await servicesModel.findById(id);
        if (!service) {
            return { status: "error", message: "Service not found!" };
        }

        // Remove the image from the file system
        if (service.img) {
            const imagePath = path.resolve(__dirname, "../../", service.img);
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

        // Delete the service
        await servicesModel.findByIdAndDelete(id);

        return { status: "success", message: "Service deleted successfully." };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};