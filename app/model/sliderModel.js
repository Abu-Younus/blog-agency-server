import mongoose from "mongoose";

const DataSchema = mongoose.Schema(
    {
        title: {type: String, unique: true, required: true},
        description: {type: String, required: true},
        img: {type: String, required: false},
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const sliderModel = mongoose.model("sliders", DataSchema);


export default sliderModel