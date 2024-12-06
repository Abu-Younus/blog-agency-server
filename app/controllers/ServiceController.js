import { createServicesService, deleteServicesService, getAllServicesService, getLatestServicesService, getServicesByIdService, updateServicesService } from "../service/ServiceServices.js";


//controller for create service
export const CreateService=async(req,res)=>{
    let result=await createServicesService(req)
    return res.json(result)
}

//get all services controller
export const GetAllServices = async (req, res) => {
    let result = await getAllServicesService();
    return res.json(result);
};

//get latest services controller
export const GetLatestServices = async (req, res) => {
    let result = await getLatestServicesService();
    return res.json(result);
};

//get service by id controller
export const GetServiceById=async(req,res)=>{
    let result=await getServicesByIdService(req)
    return res.json(result)
}

//controller for updating a service
export const UpdateService = async (req, res) => {
    let result = await updateServicesService(req);
    return res.json(result);
};

//controller for deleting a service
export const DeleteService = async (req, res) => {
    let result = await deleteServicesService(req);
    return res.json(result);
};