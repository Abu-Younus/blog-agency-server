import { createTeamMemberService, deleteTeamMemberService, getAllTeamMembersService, getLatestTeamMembersService, getTeamMemberByIdService, updateTeamMemberService } from "../service/TeamServices.js";


//controller for create team member
export const CreateTeamMember=async(req,res)=>{
    let result=await createTeamMemberService(req)
    return res.json(result)
}

//get all team members controller
export const GetAllTeamMembers = async (req, res) => {
    let result = await getAllTeamMembersService();
    return res.json(result);
};

//get latest team members controller
export const GetLatestTeamMembers = async (req, res) => {
    let result = await getLatestTeamMembersService();
    return res.json(result);
};

//get team member by id controller
export const GetTeamMemberById=async(req,res)=>{
    let result=await getTeamMemberByIdService(req)
    return res.json(result)
}

//controller for updating a team member
export const UpdateTeamMember = async (req, res) => {
    let result = await updateTeamMemberService(req);
    return res.json(result);
};

//controller for deleting a team member
export const DeleteTeamMember = async (req, res) => {
    let result = await deleteTeamMemberService(req);
    return res.json(result);
};