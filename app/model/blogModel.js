import mongoose from "mongoose";

const DataSchema = mongoose.Schema(
    {
        title: {type: String, unique: true, required: true},
        slug: {type: String, unique: true},
        content: {type: String, required: true},
        img: {type: String, required: false},
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const blogModel = mongoose.model("blogs", DataSchema);


export default blogModel