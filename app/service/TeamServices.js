import teamModel from "../model/teamModel.js";
import { BASE_URL } from "../config/config.js";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//team member create service
export const createTeamMemberService = async (req) => {
    try {
        let {name, role, bio} = req.body
    
        if(!name) {
            return { status: "error", message: "The name is required!" };
        }
    
        if(!role) {
            return { status: "error", message: "The role is required!" };
        }

        if(!bio) {
            return { status: "error", message: "The bio is required!" };
        }
        
        // Check if the team member name already exists
        const existingTeam = await teamModel.findOne({ name });
        if (existingTeam) {
            return { status: "error", message: "Team member name is already taken!" };
        }

        // Prepare the team member data to save
        let teamData = {
            name,
            role,
            bio,
        };

        // If an image was uploaded, save the path
        if (req.file) {
            teamData.img = `storage/images/${req.file.filename}`;
        }

        // Save the team to the database
        let data = await teamModel.create(teamData);
        return { status: "success", message: "Team member create successfully.", data: data };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
}

//get all team members service
export const getAllTeamMembersService = async () => {
    try {
        // Fetch all blogs
        const teamMembers = await teamModel.find().select("name role bio img createdAt updatedAt");

        // Map over team members to add the base URL to image paths
        const teamMembersData = teamMembers.map(teamMember => {
            let teamMemberImageUrl = teamMember.img ? `${BASE_URL}/${teamMember.img}` : null;

            return {
                name: teamMember.name,
                role: teamMember.role,
                bio: teamMember.bio,
                img: teamMemberImageUrl,
                createdAt: teamMember.createdAt,
                updatedAt: teamMember.updatedAt
            };
        });

        return { status: "success", message: "Team members fetched successfully.", data: teamMembersData };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

//get latest team members service
export const getLatestTeamMembersService = async () => {
    try {
        // Fetch the latest 6 team members sorted by createdAt in descending order
        const teamMembers = await teamModel
            .find()
            .sort({ createdAt: -1 }) // Sort by createdAt (latest first)
            .limit(6)               // Limit to 6 team members
            .select("name role bio img createdAt updatedAt");

        // Map over team members to format the data
        const teamMembersData = teamMembers.map(teamMember => {
            let teamMemberImageUrl = teamMember.img ? `${BASE_URL}/${teamMember.img}` : null;

            return {
                name: teamMember.name,
                role: teamMember.role,
                bio: teamMember.bio,
                img: teamMemberImageUrl,
                createdAt: teamMember.createdAt,
                updatedAt: teamMember.updatedAt
            };
        });

        return { 
            status: "success", 
            message: "Latest team members fetched successfully.", 
            data: teamMembersData 
        };
    } catch (error) {
        return { 
            status: "error", 
            error: error.toString() 
        };
    }
};

//get team member by id service
export const getTeamMemberByIdService = async (req) => {
    try {
        const { id } = req.params;
        
        // Find team member by ID
        const teamMember = await teamModel.findById(id)

        if (!teamMember) {
            return { status: "error", message: "Team member not found!" };
        }

        // Extract image name and set full image URL
        let teamMemberImageUrl = teamMember.img ? `${BASE_URL}/${teamMember.img}` : null;

        const teamMemberData = {
            name: teamMember.name,
            role: teamMember.role,
            bio: teamMember.bio,
            img: teamMemberImageUrl,
            createdAt: teamMember.createdAt,
            updatedAt: teamMember.updatedAt
        };

        return { status: "success", message: "Single team member fetched successfully.", data: teamMemberData };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

//update team member service
export const updateTeamMemberService = async (req) => {
    try {
        const { id } = req.params;
        let {name, role, bio} = req.body
    
        if(!name) {
            return { status: "error", message: "The name is required!" };
        }
    
        if(!role) {
            return { status: "error", message: "The role is required!" };
        }

        if(!bio) {
            return { status: "error", message: "The bio is required!" };
        }

        let teamMember = await teamModel.findById(id);
        if (!teamMember) {
            return { status: "error", message: "Team member not found!" };
        }

        // Update fields
        teamMember.name = name;
        teamMember.role = role;
        teamMember.bio = bio;

        // Handle image update
        if (req.file) {
            // Remove the old image if it exists
            if (teamMember.img) {
                const oldImagePath = path.resolve(__dirname, "../../", teamMember.img);
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
            teamMember.img = `storage/images/${req.file.filename}`;
        }

        await teamMember.save();
        return { status: "success", message: "Team member updated successfully.", data: teamMember };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

//delete team member service
export const deleteTeamMemberService = async (req) => {
    try {
        const { id } = req.params;

        const teamMember = await teamModel.findById(id);
        if (!teamMember) {
            return { status: "error", message: "Team member not found!" };
        }

        // Remove the image from the file system
        if (teamMember.img) {
            const imagePath = path.resolve(__dirname, "../../", teamMember.img);
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

        // Delete the team member
        await teamModel.findByIdAndDelete(id);

        return { status: "success", message: "Team member deleted successfully." };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};