import express from 'express';
import cors from "cors";

import userRoutes from "./src/routes/userroutes.js";
import { Appointment } from './src/models/appointment.js';
import mongoose from 'mongoose';
import multer from 'multer';
import path from "path";
const upload = multer({ dest: './src/uploads/'})
const port = 8080;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());






app.use("/api/v1", userRoutes);
// app.use("/static",express.static(path.join(__dirname,"public")));
app.get("/", (req, res) => {
    res.send("request come")
})
app.listen(port, () => {
    console.log(`listening is start at port ${port}`)
});