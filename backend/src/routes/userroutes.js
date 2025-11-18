
import express from "express";
import multer from "multer";
const upload = multer({ dest: 'uploads/' });
import { io } from "../../app.js";

// import { jwtDecode } from "jwt-decode";
// import status from "http-status";


import { usersignup, doctersignup, userLogin, docterLogin, isAuthenticated, refreshAccessToken } from "../controllers/mongoManeger.js"
import { getDocterList, getappointTime, appointment, getuserprofile, updateuserdata, patdel } from "../controllers/userdashreq.js";
import { Appointment } from "../models/appointment.js";


export const userRoutes = (io) => {
    const router = express.Router();
    router.post("/refresh",refreshAccessToken)
    router.delete("/pat/permdel", isAuthenticated, patdel);
    router.patch("/updatedata", isAuthenticated, updateuserdata);
    router.post("/appointment", isAuthenticated, upload.fields([
        { name: 'PatientAudio', maxCount: 1 }, 
        { name: 'PatientFile', maxCount: 4 }
    ]), appointment);
    router.get("/getuserprofile", getuserprofile);
    router.post("/usersignup", usersignup)
    router.post("/doctersignup", doctersignup);
    router.post("/userlogin", userLogin);
    router.post("/docterlogin", docterLogin);
    router.get("/getappointtime", isAuthenticated, getappointTime);
    // router.post("/hospital/docterName",getDocterName);
    router.get("/hospital/getDocterlist", isAuthenticated, getDocterList);
    return router;
}
