import express from 'express';
import cors from "cors";

import userRoutes from "./src/routes/userroutes.js";
import { Appointment } from './src/models/appointment.js';
import mongoose from 'mongoose';
import doctRoutes from "./src/routes/doctRoutes.js"
import multer from 'multer';
import path from "path";
const upload = multer({ dest: './src/uploads/'})
const port = 5050;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());






app.use("/api/v1", userRoutes);
app.use("/doc/v1",doctRoutes);
// app.use("/static",express.static(path.join(__dirname,"public")));
app.get("/test", (req, res) => {
    console.log("user route working")
  res.send("User route working!");
});
app.listen(port, () => {
    console.log(`listening is start at port ${port}`)
});