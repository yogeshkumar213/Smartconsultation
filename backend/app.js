import express from 'express';
import cors from "cors";


import { userRoutes } from "./src/routes/userroutes.js";
import { Appointment } from './src/models/appointment.js';
import mongoose from 'mongoose';
import { docterRoutes } from "./src/routes/doctRoutes.js"
import cookieParser from "cookie-parser";
import multer from 'multer';
import path from "path";
const upload = multer({ dest: './src/uploads/' })
import { createServer } from 'http';
import { Server } from 'socket.io';
const port = 5050;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true

  }
})
export { io };

// const appointmentdata = async () => {
//   try {
//     await Appointment.deleteMany({});
//     console.log("appointment data deleted");
//   }
//   catch (err) {
//     console.error("Error deleting appointment data:", err);
//   }
// }
// appointmentdata();


io.on("connection", async (socket) => {
  console.log(socket.id)
  console.log("user connected");

  // const totalAppointmenttoday = await Appointment.countDocuments();
  // console.log(totalAppointmenttoday);
  // socket.emit("totalPatient",totalAppointmenttoday);
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",  // Your frontend's address
  credentials: true, 
}));
app.use(cookieParser());





app.use("/api/v1", userRoutes(io));
app.use("/doc/v1", docterRoutes(io));
// app.use("/static",express.static(path.join(__dirname,"public")));
app.get("/test", (req, res) => {
  console.log("user route working")
  res.send("User route working!");
});
server.listen(port, () => {
  console.log(`listening is start at port ${port}`)
});