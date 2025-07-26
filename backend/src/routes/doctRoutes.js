import express from "express";
const router = express.Router();
import dotenv from "dotenv";
import { Docter } from "../models/docter.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { verifyDocter } from "../controllers/mongoManeger.js";
import { Appointment } from "../models/appointment.js";
import { io } from "../../app.js";

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
dotenv.config();


// io.emit("msg","welocme in the zone")
// router.get("/test", (req, res) => {



// })

const getAudioandReport = async (data) => {
    console.log("getAudioandReport called with req:", data);
    if (!data) return;

    const config2 = {
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    }

    const input = {
        // Bucket: "patientsensitivedata",
        // Key: data,
        // Range: "bytes=0-9"

    }

    const client = new S3Client(config2);


    const command = new GetObjectCommand(input);
    const response = await client.send(command);
    // console.log("response from aws", response);
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    console.log("signed url", url);
    return url;
}
export const docterRoutes = (io) => {


    router.post("/getpatientfile", verifyDocter, async (req, res) => {
        const { patientfile, patientAudio } = req.body;
        console.log("patientfile", patientfile);
        console.log("patientAudio", patientAudio);
        console.log("currAppointmentId", patientfile, patientAudio);
        try {
            const appointmentData = await Appointment.findOne({ PatientAudio: patientAudio });
            console.log("currAppointmentData", appointmentData);
            let patientFileUrls = [];
            let patientAudio = null;

            if (appointmentData.PatientFile && Array.isArray(appointmentData.PatientFile)) {
                const promises = appointmentData.PatientFile.map(async (el) => {
                    return await getAudioandReport(el.PatientFile)


                })

                patientFileUrls.push(...(await Promise.all(promises)));
                if (appointmentData.PatientAudio) {
                    const result = await getAudioandReport(appointmentData.PatientAudio);
                    patientAudio = result;

                }



                console.log("patientfileurls", patientFileUrls);
                console.log("patientAudio", patientAudio)
                return res.status(200).json({ appointmentData, PatientFile: patientFileUrls, audioFile: patientAudio });
            }
            else {
                const audioFile = await getAudioandReport(appointmentData.PatientAudio);
                console.log("audioFile", audioFile);
                return res.status(200).json({ appointmentData, audioFile });
            }




            // return res.status(200).json({ appointmentData, PatientFile, audioFile });



        }
        catch (err) {
            console.error("Error fetching patient file", err);
        }
    });



    router.get("/api/appointments", verifyDocter, async (req, res) => {
        console.log(req.docterId);
        try {
            const Collection = await Appointment.find({ Docter: req.docterId });
            const totalAppointment = Collection.length;
            console.log(Collection);
            console.log(totalAppointment);
            // await Appointment.countDocuments({Docter:req.docterId});

            console.log(totalAppointment);
            return res.status(200).json({ totalAppointment, Collection })
        }
        catch (err) {
            return res.status(500).json({ message: "docter not found" })
        }

        // io.emit("totalPatient", totalAppointment);
    });
    router.post("/getpatientdet", verifyDocter, async (req, res) => {
        const inputArray = req.body;
        console.log("patient appointment details", inputArray);
        const newArray = [];
        for (const item of inputArray) {


            try {
                const patDetail = await User.findById({ _id: item.Patient });
                console.log("fullDetil", patDetail);
                if (patDetail) {
                    newArray.push(patDetail);
                }
            }
            catch (err) {
                return res.status(400).json({ message: "patient detils not found" });
            }

        }
        return res.status(200).json({ message: "patient found", newArray });

    })
    router.post("/patient-srch", async (req, res) => {
        const reqBody = req.body.patient
        console.log(reqBody);
        try {
            const patientSearchDB = await User.find({ UserName: reqBody });
            // console.log(patientSearchDB)
            if (!patientSearchDB) {
                return res.status(404).json({ message: "user not found" })
            }
            const filterPatient = patientSearchDB.map((pat) => pat._id);
            console.log("filtePatient id is", filterPatient);
            filterPatient.map(async (pat) => {
                const allAppointments = await Appointment.find({ Patient: pat })
                    .populate({
                        path: "Patient",
                        select: "-Password"
                    });
                console.log(allAppointments);
                return res.status(200).json({ message: "user found", allAppointments })
            })
        }
        catch (err) {
            console.log(err)
        }

    })
    router.put("/doc-det-edit", (req, res) => {
        const result = req.body;
        const head = req.headers.doctoken;
        console.log(head)
        console.log(result);

        jwt.verify(head, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ message: "internal server err", err });
            }
            try {
                let updatedPass;
                const newPass = result?.newvalue?.password?.trim(); // safer access

                if (!newPass) {
                    // Password not provided – fetch existing hashed password
                    const findDocter = await Docter.findById(decoded.DocterId);
                    if (!findDocter) {
                        return res.status(400).json({ message: "docter not found" });
                    }
                    updatedPass = findDocter.Password; // keep existing hash
                } else {
                    // Password provided – hash it
                    updatedPass = await bcrypt.hash(newPass, 10);
                    console.log("Password hashed:", updatedPass);
                }

                const updatedDoc = await Docter.findOneAndUpdate(
                    { _id: decoded.DocterId },
                    {
                        $set: {
                            Email: result.newvalue.Email,
                            Password: updatedPass
                        }
                    },
                    { new: true }
                );
                console.log(updatedDoc);

                if (updatedDoc) {
                    return res.status(200).json({ message: "docter profile updated successfully" });
                } else {
                    return res.status(404).json({ message: "docter not found" });
                }
            } catch (err) {
                console.log("Server error:", err);
                return res.status(500).json({ message: "server error" });
            }
        });

    });

    return router;
}
