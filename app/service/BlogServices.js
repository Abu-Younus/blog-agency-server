import blogModel from "../model/blogModel.js";
import { createSlug } from "../utility/slugUtility.js";
import { BASE_URL } from "../config/config.js";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//blog create service
export const createBlogService = async (req) => {
    try {
        let {title, content} = req.body
    
        if(!title) {
            return { status: "error", message: "The title is required!" };
        }
    
        if(!content) {
            return { status: "error", message: "The content is required!" };
        }
        
        // Check if the blog title already exists
        const existingBlog = await blogModel.findOne({ title });
        if (existingBlog) {
            return { status: "error", message: "Blog title is already taken!" };
        }

        // Create slug
        const blogSlug = await createSlug(title);

        // Prepare the blog data to save
        let blogData = {
            title,
            blogSlug,
            content,
        };

        // If an image was uploaded, save the path
        if (req.file) {
            blogData.img = `storage/images/${req.file.filename}`;
        }

        // Save the blog to the database
        let data = await blogModel.create(blogData);
        return { status: "success", message: "Blog create successfully.", data: data };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
}

//get all blogs service
export const getAllBlogsService = async () => {
    try {
        // Fetch all blogs
        const blogs = await blogModel.find().select("title slug content img createdAt updatedAt");

        // Map over blogs to add the base URL to image paths
        const blogsData = blogs.map(blog => {
            let blogImageUrl = blog.img ? `${BASE_URL}/${blog.img}` : null;

            return {
                title: blog.title,
                slug: blog.slug,
                content: blog.content,
                img: blogImageUrl,
                createdAt: blog.createdAt,
                updatedAt: blog.updatedAt
            };
        });

        return { status: "success", message: "Blogs fetched successfully.", data: blogsData };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

//get latest blog service
export const getLatestBlogsService = async () => {
    try {
        // Fetch the latest 6 blogs sorted by createdAt in descending order
        const blogs = await blogModel
            .find()
            .sort({ createdAt: -1 })
            .limit(6)
            .select("title slug content img createdAt updatedAt");

        // Map over blogs to format the data
        const blogsData = blogs.map(blog => {
            let blogImageUrl = blog.img ? `${BASE_URL}/${blog.img}` : null;

            return {
                title: blog.title,
                slug: blog.slug,
                content: blog.content,
                img: blogImageUrl,
                createdAt: blog.createdAt,
                updatedAt: blog.updatedAt
            };
        });

        return { 
            status: "success", 
            message: "Latest blogs fetched successfully.", 
            data: blogsData 
        };
    } catch (error) {
        return { 
            status: "error", 
            error: error.toString() 
        };
    }
};

//get blog by id service
export const getBlogByIdService = async (req) => {
    try {
        const { id } = req.params;
        
        // Find blog by ID
        const blog = await blogModel.findById(id)

        if (!blog) {
            return { status: "error", message: "Blog not found!" };
        }

        // Extract image name and set full image URL
        let blogImageUrl = blog.img ? `${BASE_URL}/${blog.img}` : null;

        const blogData = {
            title: blog.title,
            slug: blog.slug,
            content: blog.content,
            img: blogImageUrl,
            createdAt: blog.createdAt,
            updatedAt: blog.updatedAt
        };

        return { status: "success", message: "Single blog fetched successfully.", data: blogData };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

//update blog service
export const updateBlogService = async (req) => {
    try {
        const { id } = req.params;
        let {title, content} = req.body
    
        if(!title) {
            return { status: "error", message: "The title is required!" };
        }
    
        if(!content) {
            return { status: "error", message: "The content is required!" };
        }

        let blog = await blogModel.findById(id);
        if (!blog) {
            return { status: "error", message: "Blog not found!" };
        }

        // Create slug
        const blogSlug = await createSlug(title);

        // Update fields
        blog.title = title;
        blog.slug = blogSlug;
        blog.content = content;

        // Handle image update
        if (req.file) {
            // Remove the old image if it exists
            if (blog.img) {
                const oldImagePath = path.resolve(__dirname, "../../", blog.img);
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
            blog.img = `storage/images/${req.file.filename}`;
        } 

        await blog.save();
        return { status: "success", message: "Blog updated successfully.", data: blog };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

//delete blog service
export const deleteBlogService = async (req) => {
    try {
        const { id } = req.params;

        const blog = await blogModel.findById(id);
        if (!blog) {
            return { status: "error", message: "Blog not found!" };
        }

        // Remove the image from the file system
        if (blog.img) {
            const imagePath = path.resolve(__dirname, "../../", blog.img);
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

        // Delete the blog
        await blogModel.findByIdAndDelete(id);

        return { status: "success", message: "Blog deleted successfully." };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};