import mongoose from "mongoose";

const DataSchema = mongoose.Schema(
    {
        description: {type: String, required: true},
        img: {type: String, required: false},
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const aboutModel = mongoose.model("about", DataSchema);


export default aboutModel