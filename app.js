import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from "helmet";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import multer from "multer";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import router from "./routes/api.js";
import { DATABASE, MAX_JSON_SIZE, PORT, REQUEST_NUMBER, REQUEST_TIME, URL_ENCODE, WEB_CACHE } from "./app/config/config.js";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// App Use Default Middleware
app.use(cors());
app.use(express.json({ limit: MAX_JSON_SIZE }));
app.use(express.urlencoded({ extended: URL_ENCODE }));
app.use(helmet())
app.use(cookieParser());

// App Use Limiter
const limiter = rateLimit({ windowMs: REQUEST_TIME, max: REQUEST_NUMBER })
app.use(limiter)

// Cache
app.set('etag', WEB_CACHE)

//file location
app.use('/storage', express.static(path.join(__dirname, 'storage')));

// Database Connect
mongoose.connect(DATABASE, { autoIndex: true }).then(() => {
    console.log("Database connected");
}).catch(() => {
    console.log("Database disconnected");
})

app.use("/api", router)

//multer error file handling
app.use((err, req, res, next) => {
    if(err instanceof multer.MulterError) {
        return res.status(418).json({
            err_code: err.code,
            err_message: err.message
        })
    } else {
        return res.status(500).json({
            err_code: 500,
            err_message: "Something went wrong!"
        })
    }
})

//404 route
app.use("*", (req, res) => {
    res.status(404).json({status: "Not Found", data: "Your requested resource is not found!"})
})

app.listen(PORT, () => {
    console.log("Server started on port " + PORT)
})