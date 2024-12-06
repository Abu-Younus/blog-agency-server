import { createBlogService, deleteBlogService, getAllBlogsService, getBlogByIdService, getLatestBlogsService, updateBlogService } from "../service/BlogServices.js";

//controller for create blog
export const CreateBlog=async(req,res)=>{
    let result=await createBlogService(req)
    return res.json(result)
}

//get all blogs controller
export const GetAllBlogs = async (req, res) => {
    let result = await getAllBlogsService();
    return res.json(result);
};

//get latest blogs controller
export const GetLatestBlogs = async (req, res) => {
    let result = await getLatestBlogsService();
    return res.json(result);
};


//get blog by id controller
export const GetBlogById=async(req,res)=>{
    let result=await getBlogByIdService(req)
    return res.json(result)
}

//controller for updating a blog
export const UpdateBlog = async (req, res) => {
    let result = await updateBlogService(req);
    return res.json(result);
};

//controller for deleting a blog
export const DeleteBlog = async (req, res) => {
    let result = await deleteBlogService(req);
    return res.json(result);
};