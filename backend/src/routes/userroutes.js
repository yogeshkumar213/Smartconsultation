import { Router } from "express";
import express from "express";
import multer from "multer";
const upload = multer({ dest: 'uploads/' })
// import { jwtDecode } from "jwt-decode";
import status from "http-status";

import { usersignup, doctersignup, userLogin, docterLogin, isAuthenticated } from "../controllers/mongoManeger.js"
import { getDocterList, getappointDate, appointment,getuserprofile ,updateuserdata} from "../controllers/userdashreq.js";
// import { Appointment } from "../models/appointment.js";

const router = express.Router();


router.patch("/updatedata",isAuthenticated,updateuserdata);
router.post("/appointment", isAuthenticated, upload.fields([
    { name: 'PatientAudio', maxCount: 1 },
    { name: 'PatientFile', maxCount: 1 }
]), appointment);
router.get("/getuserprofile",getuserprofile);
router.post("/usersignup", usersignup)
router.post("/doctersignup", doctersignup);
router.post("/userlogin", userLogin);
router.post("/docterlogin", docterLogin);
router.get("/getappointDate", isAuthenticated, getappointDate);
// router.post("/hospital/docterName",getDocterName);
router.get("/hospital/getDocterlist", isAuthenticated, getDocterList);
export default router