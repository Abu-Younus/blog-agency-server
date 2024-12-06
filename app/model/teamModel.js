import mongoose from "mongoose";

const DataSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        role: {type: String, required: true},
        bio: { type: String, required: true},
        img: {type: String, required: false},
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const teamModel = mongoose.model("team_members", DataSchema);


export default teamModel