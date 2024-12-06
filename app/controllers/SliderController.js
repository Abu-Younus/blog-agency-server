import { createSliderService, deleteSliderService, getAllSlidersService, getLatestSlidersService, getSliderByIdService, updateSliderService } from "../service/SliderServices.js";

//controller for create slider
export const CreateSlider=async(req,res)=>{
    let result=await createSliderService(req)
    return res.json(result)
}

//get all sliders controller
export const GetAllSliders = async (req, res) => {
    let result = await getAllSlidersService();
    return res.json(result);
};

//get latest sliders controller
export const GetLatestSliders = async (req, res) => {
    let result = await getLatestSlidersService();
    return res.json(result);
};

//get slider by id controller
export const GetSliderById=async(req,res)=>{
    let result=await getSliderByIdService(req)
    return res.json(result)
}

//controller for updating a slider
export const UpdateSlider = async (req, res) => {
    let result = await updateSliderService(req);
    return res.json(result);
};

//controller for deleting a slider
export const DeleteSlider = async (req, res) => {
    let result = await deleteSliderService(req);
    return res.json(result);
};