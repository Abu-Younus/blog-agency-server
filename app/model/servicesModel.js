import mongoose from "mongoose";

const DataSchema = mongoose.Schema(
    {
        title: {type: String, unique: true, required: true},
        slug: {type: String, unique: true},
        description: {type: String, required: true},
        img: {type: String, required: false},
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const servicesModel = mongoose.model("services", DataSchema);


export default servicesModel