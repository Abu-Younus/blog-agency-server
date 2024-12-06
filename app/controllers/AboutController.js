import { createAboutService, deleteAboutService, getAboutByIdService, getAllAboutService, getLatestAboutService, updateAboutService } from "../service/AboutServices.js";


//controller for create about
export const CreateAbout=async(req,res)=>{
    let result=await createAboutService(req)
    return res.json(result)
}

//get all about controller
export const GetAllAbout = async (req, res) => {
    let result = await getAllAboutService();
    return res.json(result);
};

//get latest about controller
export const GetLatestAbout = async (req, res) => {
    let result = await getLatestAboutService();
    return res.json(result);
};

//get about by id controller
export const GetAboutById=async(req,res)=>{
    let result=await getAboutByIdService(req)
    return res.json(result)
}

//controller for updating a about
export const UpdateAbout = async (req, res) => {
    let result = await updateAboutService(req);
    return res.json(result);
};

//controller for deleting a about
export const DeleteAbout = async (req, res) => {
    let result = await deleteAboutService(req);
    return res.json(result);
};