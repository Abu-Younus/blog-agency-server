import mongoose from "mongoose";

const DataSchema = mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, unique: true, required: true, lowercase: true },
        password: { type: String, required: true },
        img: { type: String, required: false },
        role: { type: String, enum: ['admin', 'user'], default: 'user' } 
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const usersModel = mongoose.model("users", DataSchema);


export default usersModel