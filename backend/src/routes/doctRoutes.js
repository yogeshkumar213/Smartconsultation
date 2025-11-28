import express, { response } from "express";

import dotenv from "dotenv";
import axios from "axios";
import { Docter } from "../models/docter.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { verifyDocter } from "../controllers/mongoManeger.js";
import { Appointment } from "../models/appointment.js";
import { io } from "../../app.js";
import mime from "mime-types";

import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { appointment } from "../controllers/userdashreq.js";
import { TextractClient, ListAdaptersCommand, DetectDocumentTextCommand } from "@aws-sdk/client-textract";
import { get } from "http";
import { Upload } from "@aws-sdk/lib-storage";
import multer from "multer";
import fs from "fs";
import path from "path";
import { json } from "stream/consumers";
import { type } from "os";
import mongoose from "mongoose";
import { Counter } from "../models/counter.js";


dotenv.config();


// io.emit("msg","welocme in the zone")
// router.get("/test", (req, res) => {



// })
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

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


    // console.log("secretaccesskey",process.env.AWS_SECRET_ACCESS_KEY);
    // console.log("accesskeyid", process.env.AWS_ACCESS_KEY_ID);
    // console.log("region",process.env.AWS_REGION);

    const input = {
        Bucket: "patientsensitivedata",
        Key: data.key,


    }

    const client = new S3Client(config2);


    const command = new GetObjectCommand(input);

    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    console.log("signed url", url);
    return {
        signedUrl: url,
        mimetype: data.key
    }
}
export const docterRoutes = (io) => {

    //   router.post("/smart", async (req, res) => {
    //     const { audioSignedUrl } = req.body;

    //     try {
    //         // Fetch audio as arraybuffer
    //         const fileResponse = await axios.get(audioSignedUrl, { responseType: "arraybuffer" });
    //         const arrayBuffer = fileResponse.data;

    //         // Convert to Uint8Array and then to array of numbers
    //         const uint8 = new Uint8Array(arrayBuffer);
    //         const audioArray = Array.from(uint8);

    //         // Send to Cloudflare
    //         const cfResponse = await axios.post(
    //             "https://api.cloudflare.com/client/v4/accounts/0f18dad60774e20250bb3b0482f18e52/ai/run/@cf/openai/whisper",
    //             { audio: audioArray },  // correct format
    //             {
    //                 headers: {
    //                     "Authorization": "Bearer POEFWBmbCQW-Oq5dbbuitlVgmpcJkh_XjM41JGx2",
    //                     "Content-Type": "application/json"
    //                 }
    //             }
    //         );

    //         console.log(cfResponse.data);
    //         res.json(cfResponse.data);

    //     } catch (err) {
    //         console.error(err.response?.data || err.message);
    //         res.status(500).json({ error: err.response?.data || err.message });
    //     }
    // });

    router.post("/uploadReport", upload.array("docterAttachedFile", 4), (async (req, res) => {
        console.log("uploadReport called with req:", req.body);
        console.log("Uploaded files:", req.files);
        const patientDocument = req.body.currPatientDocument;
        let currDocument;
        if (typeof patientDocument === 'string' && patientDocument.length > 0) {
            try {
                currDocument = JSON.parse(patientDocument);
                console.log("currPatientDocument", currDocument);

            }
            catch (e) {
                console.error("Failed to parse currPatientDocument JSON:", e);
                return res.status(400).json({ message: "Invalid patient document format." });
            }
        }

        try {
            const patientReportFiles = req.files;
            const config1 = {
                region: process.env.AWS_REGION,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
            }
            const client = new S3Client(config1);

            let uploadedFiles = [];
            uploadedFiles = await Promise.all(patientReportFiles.map(async (file) => {
                const patientFileStream = fs.createReadStream(path.resolve(file.path));
                const ext = mime.extension(file.mimetype);
                const keyId = `${file.filename}.${ext}`
                const input = {
                    Bucket: "patientsensitivedata",
                    Body: patientFileStream,
                    Key: keyId,
                    ContentType: file.mimetype
                };
                await client.send(new PutObjectCommand(input));
                fs.unlink(file.path, (err) => {
                    console.log("err deleting patientfiles", err)
                })

                return {
                    key: keyId,
                    mimetype: file.mimetype
                }
            }))
            console.log("uploadedFiles", uploadedFiles);

            const storeFilesInDB = await Appointment.findOneAndUpdate({ _id: currDocument }, { $push: { 'ConsultationNotes.UploadedReport': { $each: uploadedFiles } } }, { new: true });
            console.log("storeFilesInDB", storeFilesInDB);
            const findUser = await User.findOne({
                _id: currDocument.
                    appointmentData
                    .Patient
            });
            console.log("findUser", findUser);

            res.status(200).json({ message: `${findUser.UserName} files uploaded successfully` }); //storeFilesInDB

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "internal server error", err });
        }


    }));

    router.post("/markAppointmentComp", async (req, res) => {
        const { Docter, PatientAudio, PatientFile } = req.body.currPatientDocument;
        const appointmentId = req.body.currPatientDocument._id;
        console.log("currPatientDocument", req.body);
        if (!appointmentId) {
            return res.status(400).json({ message: "Appointment ID is required" });
        }

        const updatedFields = {
            isCompleted: true,
            'ConsultationNotes.consultedAt': new Date()
        }
        try {
            const markAppointmentComp = await Appointment.findOneAndUpdate({ _id: appointmentId }, { $set: updatedFields }, { new: true });
            console.log("markAppointmentComp", markAppointmentComp);
            if (markAppointmentComp) {
                const nextPatientAppointment = await getcurQueue();
                res.status(200).json({ message: "Appointment marked as completed successfully", nextPatientAppointment });

                io.emit("totalConsultedPatients", "updated count");
                io.emit("totalWaitingPatient", "change waiting data");
            }
            else {
                res.status(404).json({ message: "Appointment not found" });
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "internal server error" });
        }


    }

    )
    router.post("/getaudioandReportanalysis", async (req, res) => {
        console.log("getnextpatient called");
        // console.log("getnextpatient called with req:", req.body.nextPatientDetails);
        const { audioAndReport } = req.body.nextPatientDetails;
        // console.log("req.body.nextPatientDetails", req.body.nextPatientDetails);
        const audio = audioAndReport[0].audio;
        const report = audioAndReport[0].report;
        const key = audioAndReport[0].report[0].key;
        console.log("audio and report", audio, report);
        try {
            const fileResponse = await axios.get(audio.signedUrl, { responseType: "arraybuffer" });
            const res1 = fileResponse.data;

            const input = {
                audio: [...new Uint8Array(res1)],
            };
            const cfResponse = await axios.post(
                "https://api.cloudflare.com/client/v4/accounts/0f18dad60774e20250bb3b0482f18e52/ai/run/@cf/openai/whisper",
                input,

                {
                    headers: {
                        "Authorization": "Bearer POEFWBmbCQW-Oq5dbbuitlVgmpcJkh_XjM41JGx2",
                        "Content-Type": "application/json"
                    }
                }
                // correct format
            );
            console.log("Whisper response:", cfResponse.data.result.text);
            const audtioTranscript = cfResponse.data.result.text;
            console.log("Reportkey", key);
            const TEXTRACT_CLIENT = new TextractClient({ region: process.env.AWS_REGION });
            const params = {
                Document: {
                    S3Object: {
                        Bucket: "patientsensitivedata",
                        Name: key

                    }
                }
            }

            const command = new DetectDocumentTextCommand(params);
            const data = await TEXTRACT_CLIENT.send(command);
            // console.log("data", data);
            let extractedText = "";
            if (data.Blocks) {
                extractedText = data.Blocks.filter(blocks => blocks.BlockType === 'LINE').map(block => block.Text).join('\n');

            }
            console.log("clean extracted Reports", extractedText);
            const userPrompt = `
        Analyze the following patient's condition by cross-referencing the self-reported symptoms and the official medical report.

          1.  **Patient Symptoms (Audio Transcript):**
        ---
        ${audtioTranscript}
        ---

      2.  **Medical Findings (Report Text):**
       ---
       ${extractedText}
      ---

         Please provide a structured, simple summary in Hinglish that compares the patient's complaint with the report's diagnosis/finding.
        `;
            const messages = [
                {
                    "role": "system",
                    "content": "You are a safe medical assistant.\nDo NOT diagnose. Give only general health information based on the provided report and symptoms.\nYour primary task is to **synthesize** the patient's self-reported symptoms (Audio Transcript) with the clinical findings (Report Text).\nAlways include red flags and when to see a doctor.\n\nIMPORTANT STYLE RULES:\n- Reply directly to the user's message.\n- NO greetings. NO introductions. NO disclaimers unless medically needed.\n- Keep the answer short and in simple Hinglish.\n- **Use markdown bullet points or numbered lists for all symptoms, causes, or lists of information.**\n- **Use **bold text** for important health values aur jab turant doctor se milne ki salah deni ho.**\n"
                },

                {
                    "role": "user",
                    "content": userPrompt
                },
            ];


            const llmaResponse = await axios.post("https://api.cloudflare.com/client/v4/accounts/0f18dad60774e20250bb3b0482f18e52/ai/run/@cf/meta/llama-3.1-70b-instruct",
                { messages },
                {
                    headers: {
                        "Authorization": "Bearer POEFWBmbCQW-Oq5dbbuitlVgmpcJkh_XjM41JGx2",
                        "Content-Type": "application/json"
                    }
                }

            );
            console.log("analysis report Data", llmaResponse.data.result);
            res.status(200).json({ messages: "successfully fetched audio and report analysis", Analysdata: llmaResponse.data.result?.response?.trim(), TranscriptData: cfResponse.data.result.text });

        } catch (err) {
            console.error(err.response?.data || err.message);
            res.status(500).json({ error: err.response?.data || err.message });
            return;
        }




        // const { audioAndReport: audioAndReport = [], user } = req.body.nextPatientDetails;
        // if (!audioAndReport || !Array.isArray(audioAndReport)) {
        //     return res.status(400).json({ message: "Invalid audioAndReport data" });
        // }
        // const currAppoinment = [];
        // const pastAppoinments = [];
        // const findcurrentAppointmentAndPastAppointment = await Promise.all(audioAndReport.map(async (appointment) => {
        //     const appoint = await Appointment.findOne({ _id: appointment.appointmentId });
        //     if (appoint.isCompleted === false) {
        //         currAppoinment.push({
        //             Date: appoint.Date,
        //             appointmentId: appoint._id,
        //             audioData: appointment.audioData,
        //             reportData: appointment.reportData,
        //             isCompleted: appoint.isCompleted
        //         })
        //     }
        //     else {
        //         pastAppoinments.push({
        //             Date: appoint.Date,
        //             appointmentId: appoint._id,
        //             audioData: appointment.audioData,
        //             reportData: appointment.reportData,
        //             isCompleted: appoint.isCompleted

        //         })
        //     }
        // }))
        // console.log("currAppoinment", currAppoinment);
        // console.log("pastAppoinments", pastAppoinments);




    });
    router.get("/getnextpatient", verifyDocter, async (req, res) => {
        // console.log("getnextpatient called", req.body);
        const { docterId } = req;
        const getNextPatient = await getNextCurrQueue(docterId);
        console.log("getnextpatient", getNextPatient);
        if (!getNextPatient) {
            // If getnextpatient is null, undefined, or an empty document (based on Mongoose behavior)
            console.log("No uncompleted patients found for this doctor.");

            // Respond to the client indicating the queue is empty
            return res.status(200).json({
                message: "Today's appointment queue is completed.",
                nextPatientAppointment: null
            });
        }


        // const { Patient, PatientAudio, PatientFile } = req.body.nextPatient;
        // console.log("Patient,PatientAudio,PatientFile", Patient, PatientAudio, PatientFile);
        // const findUser = await User.findOne({ _id: Patient });

        // if (!findUser) {
        //     // User not found, return 404
        //     return res.status(404).json({ message: "Patient not found." });
        // }
        // console.log("findUser", findUser);
        // in future change this because searching past data on the basis of name is not a good way 

        try {

            const audio = await getAudioandReport(getNextPatient?.PatientAudio);
            const getReport = await Promise.all(getNextPatient?.PatientFile.map(async (prev) => {
                const report = await getAudioandReport(prev);
                return {
                    report: report,
                    key: prev.key
                };


            }));
            console.log("files and audio", getReport, audio);



            res.status(200).json({ message: "data successfully fetched", nextUser: getNextPatient.Patient, audio: audio, report: getReport,extraDetails:getNextPatient});
        }
        catch (err) {
            console.log(err);
            res.status(404).json({ message: "excessing the files from aws found err ", err });
        }
    })





    router.post("/smart", async (req, res) => {
        const { audioSignedUrl, selectedOpt
        } = req.body;
        console.log(selectedOpt);
        if (selectedOpt === "Voice-Transcript") {
            try {
                // Fetch audio as arraybuffer
                const fileResponse = await axios.get(audioSignedUrl, { responseType: "arraybuffer" });
                const res1 = fileResponse.data;

                // Convert to Uint8Array and then to plain array
                const uint8 = new Uint8Array(res1);
                const audioArray = Array.from(uint8); // values 0-255

                // Prepare input exactly as required
                const input = { audio: audioArray };

                // Send to Cloudflare REST API
                const cfResponse = await axios.post(
                    "https://api.cloudflare.com/client/v4/accounts/0f18dad60774e20250bb3b0482f18e52/ai/run/@cf/openai/whisper",
                    input,  // ONLY audio array
                    {
                        headers: {
                            "Authorization": "Bearer POEFWBmbCQW-Oq5dbbuitlVgmpcJkh_XjM41JGx2",
                            "Content-Type": "application/json"
                        }
                    }
                );

                console.log("Whisper response:", cfResponse.data.result.text);
                res.status(200).json({ data: cfResponse.data.result.text, option: selectedOpt })

            } catch (err) {
                console.error("Error:", err.response?.status, err.response?.data);
            }

        }
        else if (selectedOpt === "Alternate-Script") {
            try {
                const fileResponse = await axios.get(audioSignedUrl, { responseType: "arraybuffer" });
                const res1 = fileResponse.data;

                const input = {
                    audio: Buffer.from(res1, 'binary').toString("base64"),
                    language: "hi",

                    // task: "translate"

                };

                // Send to Cloudflare
                const cfResponse = await axios.post(
                    "https://api.cloudflare.com/client/v4/accounts/0f18dad60774e20250bb3b0482f18e52/ai/run/@cf/openai/whisper-large-v3-turbo",
                    input,  // correct format
                    {
                        headers: {
                            "Authorization": "Bearer POEFWBmbCQW-Oq5dbbuitlVgmpcJkh_XjM41JGx2",
                            "Content-Type": "application/json"
                        }
                    }
                );

                console.log("data", cfResponse.data.result.text);




                const messages = [
                    {
                        "role": "system",
                        "content": "- **First, translate the user's input (the audio transcript) into Hinglish before processing the medical request.**"
                    },

                    {
                        "role": "user",
                        "content": cfResponse.data.result.text,
                    },
                ];


                const llmaResponse = await axios.post("https://api.cloudflare.com/client/v4/accounts/0f18dad60774e20250bb3b0482f18e52/ai/run/@cf/meta/llama-3.1-70b-instruct",
                    { messages },
                    {
                        headers: {
                            "Authorization": "Bearer POEFWBmbCQW-Oq5dbbuitlVgmpcJkh_XjM41JGx2",
                            "Content-Type": "application/json"
                        }
                    }

                );
                console.log("stream.data", llmaResponse.data.result);
                res.status(200).json({
                    data: llmaResponse.data.result?.response?.trim(),
                    option: selectedOpt

                })

            } catch (err) {
                console.error(err.response?.data || err.message);
                res.status(500).json({ error: err.response?.data || err.message });
            }



        }
        else {

            try {
                const fileResponse = await axios.get(audioSignedUrl, { responseType: "arraybuffer" });
                const res1 = fileResponse.data;

                const input = {
                    audio: Buffer.from(res1, 'binary').toString("base64"),
                    language: "hi",

                    // task: "translate"

                };

                // Send to Cloudflare
                const cfResponse = await axios.post(
                    "https://api.cloudflare.com/client/v4/accounts/0f18dad60774e20250bb3b0482f18e52/ai/run/@cf/openai/whisper-large-v3-turbo",
                    input,  // correct format
                    {
                        headers: {
                            "Authorization": "Bearer POEFWBmbCQW-Oq5dbbuitlVgmpcJkh_XjM41JGx2",
                            "Content-Type": "application/json"
                        }
                    }
                );

                console.log("data", cfResponse.data.result.text);




                const messages = [
                    {
                        "role": "system",
                        "content": "You are a safe medical assistant.\nDo NOT diagnose.\nGive only general health information.\nAlways include red flags and when to see a doctor.\n\nIMPORTANT STYLE RULES:\n- Reply directly to the user's message.\n- NO greetings.\n- NO introductions.\n- NO disclaimers unless medically needed.\n- NO extra lines or fluff.\n- Keep the answer short and in simple Hinglish.\n- **Use markdown bullet points or numbered lists for all symptoms, causes, or lists of information (like red flags).**\n- **Use **bold text** for important health values (jaise ki normal temperature) aur jab turant doctor se milne ki salah deni ho.**\n"
                    },

                    {
                        "role": "user",
                        "content": cfResponse.data.result.text,
                    },
                ];


                const llmaResponse = await axios.post("https://api.cloudflare.com/client/v4/accounts/0f18dad60774e20250bb3b0482f18e52/ai/run/@cf/meta/llama-3.1-70b-instruct",
                    { messages },
                    {
                        headers: {
                            "Authorization": "Bearer POEFWBmbCQW-Oq5dbbuitlVgmpcJkh_XjM41JGx2",
                            "Content-Type": "application/json"
                        }
                    }

                );
                console.log("stream.data", llmaResponse.data.result);
                res.status(200).json({
                    data: llmaResponse.data.result?.response?.trim(),
                    option: selectedOpt

                })

            } catch (err) {
                console.error(err.response?.data || err.message);
                res.status(500).json({ error: err.response?.data || err.message });
            }



        }


    });










    router.post("/getpatientfile", verifyDocter, async (req, res) => {
        const { patientfile, patientAudio1 } = req.body;
        console.log("patientfile", patientfile);
        console.log("patientAudio", patientAudio1);
        console.log("currAppointment Patienfile and audio", patientfile, patientAudio1);
        try {
            const appointmentData = await Appointment.findOne({ PatientAudio: patientAudio1 });
            console.log("currAppointmentData", appointmentData);
            let patientFileUrls = [];
            let patientAudio = null;

            if (appointmentData.PatientFile && Array.isArray(appointmentData.PatientFile)) {
                const promises = appointmentData.PatientFile.map(async (el) => {
                    return await getAudioandReport(el);

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
            // else {
            //     const audioFile = await getAudioandReport(appointmentData.PatientAudio);
            //     console.log("audioFile", audioFile);
            //     return res.status(200).json({ appointmentData, audioFile });
            // }




            // return res.status(200).json({ appointmentData, PatientFile, audioFile });



        }
        catch (err) {
            console.error("Error fetching patient file", err);
        }
    });

    router.post("/docter-dashboard/savesymtoms", async (req, res) => {
        const data = req.body;
        console.log("symtoms", req.body);

        try {
            const saveToDB = await Appointment.findOneAndUpdate({ _id: data._id }, {
                ConsultationNotes: {
                    Symtoms: data.Symtoms,
                    ProbableCause: data.ProbableCause,
                    PrescribedMedications: data.PrescribedMedications,
                    TreatmentAdvice: data.TreatmentAdvice,
                    FollowUpSuggestions: data.FollowUpSuggestions
                }

            });
            console.log("booked appointment", saveToDB);
            res.status(200).json({ message: "consultaion input successfully added", saveToDB })

        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: "internal server Error", err })
        }

    });


    router.get("/docter-dashboard/getconsultedInput/:id", async (req, res) => {
        try {
            const id = req.params.id;
            console.log("id", id);
            const findconsultedInput = await Appointment.findOne({ _id: id })
            console.log("findconsultedInput", findconsultedInput);
            res.status(200).json({ message: "consulted input found", ConsultedInput: findconsultedInput.ConsultationNotes })


        }
        catch (err) {
            res.status(404).json({ message: "consulted input not found" })
        }



    })

    router.get("/docter-dashboard/appointment/history/:id", async (req, res) => {
        const id = req.params.id;
        console.log("for patient pastAppointment", id);
        try {
            const currAppoinment = await Appointment.findOne({ _id: id });
            // console.log(currAppoinment);
            const totalpastAppointment = await Appointment.find({ Patient: currAppoinment.Patient, _id: { $ne: id } })

            console.log("pastAppointment", totalpastAppointment);
            res.status(200).json({ message: "past appointment found", totalpastAppointment });
        }
        catch (err) {
            console.log(err);
        }
    })

    router.get("/api/consultedPatients", verifyDocter, async (req, res) => {
        console.log("docterid for consulted patients:", req.docterId);
        // const today = new Date();
        // today.setHours(0, 0, 0, 0);
        // const startOfDay = today;

        // const endOfDay = new Date(today);
        // endOfDay.setHours(23, 59, 59, 999);
        const todayString = new Date().toISOString().split('T')[0];

        try {

            const Collection = await Appointment.aggregate([
                {
                    $match: {
                        Docter: req.docterId,
                        $expr: {
                            $eq: [
                                { $dateToString: { format: "%Y-%m-%d", date: "$Date", timezone: "Asia/Kolkata" } },
                                todayString
                            ]
                        }
                    }
                },
                { $project: { _id: 1, Patient: 1, Docter: 1, Date: 1, Time: 1, isCompleted: 1, ConsultationNotes: 1, PatientAudio: 1, PatientFile: 1, createdAt: 1 } }
            ]);
            const todayConsultedAppointments = Collection.filter(appointment => appointment.isCompleted);
            const totalConsultedPatients = todayConsultedAppointments.length;
            // io.emit("totalConsultedPatients", totalConsultedPatients);

            // console.log("todayConsultedAppointments", todayConsultedAppointments);
            res.status(200).json({ message: "consulted patients fetched", totalConsultedPatients });//only active appointments
        }
        catch (err) {
            return res.status(500).json({ message: "docter not found" })
        }
    })



    router.post("/api/appointments/waiting", verifyDocter, async (req, res) => {
        // console.log("docterid for waiting patients:", req.docterId);
        console.log("req body for waiting patients:", req.body);
        const currPatientAppointmentId = req.body._id;
        console.log("currPatientAppointmentId", currPatientAppointmentId);

        // const today = new Date();//day,date,year
        // today.setHours(0, 0, 0, 0);

        // const startOfDay = today;

        // const endOfDay = new Date(today);
        // endOfDay.setHours(23, 59, 59, 999);

        const todayString = new Date().toISOString().split('T')[0];
        console.log("todayDate", todayString);
        const excludedId = new mongoose.Types.ObjectId(currPatientAppointmentId);
        console.log("excludedId", excludedId);

        try {

            const Collection = await Appointment.aggregate([
                {
                    $match: {
                        Docter: req.docterId,

                        $expr: {
                            $eq: [
                                { $dateToString: { format: "%Y-%m-%d", date: "$Date", timezone: "Asia/Kolkata" } },
                                todayString
                            ]
                        }, _id: { $ne: excludedId }
                    }
                },
                { $project: { _id: 1, Patient: 1, Docter: 1, Date: 1, Time: 1, isCompleted: 1, ConsultationNotes: 1, PatientAudio: 1, PatientFile: 1, createdAt: 1 } }
            ]);
            console.log("Collection", Collection);
            const waitingAppointments = Collection.filter(appointment => !appointment.isCompleted);
            console.log("waitingAppointment", waitingAppointments);
            const totalWaitingAppointments = waitingAppointments.length;
            console.log("totalWaitingAppointments", totalWaitingAppointments);



            res.status(200).json({ message: "waiting patients fetched", totalWaitingAppointments, waitingAppointments });//only active appointments
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: "docter not found", err })
        }

    })
    const getcurQueue = async (docterid) => {
        const queue = await Appointment.findOne({
            Docter: new mongoose.Types.ObjectId(docterid),
            isCompleted: false
        }).sort({ QueueNum: 1 }).populate("Patient");
        return queue;

    }
    const getNextCurrQueue = async (docterid) => {
        const queue = await Appointment.findOne({
            Docter: new mongoose.Types.ObjectId(docterid),
            isCompleted: false,
        }).sort({ QueueNum: 1 }).skip(1)
            .populate(["Patient","Docter"]);
        return queue;
    }
    router.get("/api/appointments", verifyDocter, async (req, res) => {
        console.log("docterid:", req.docterId);

        // const today = new Date();//day,date,year
        // today.setHours(0, 0, 0, 0);
        // const startOfDay = today;

        // const endOfDay = new Date(today);
        // endOfDay.setHours(23, 59, 59, 999);
        const todayString = new Date().toISOString().split('T')[0];
        console.log("todayString", todayString);


        try {
            const doctorObjectId = new mongoose.Types.ObjectId(req.docterId);

            const Collection = await Appointment.aggregate([
                {
                    $match: {
                        Docter: doctorObjectId,
                        $expr: {
                            $eq: [
                                { $dateToString: { format: "%Y-%m-%d", date: "$Date", timezone: "Asia/Kolkata" } },
                                todayString
                            ]
                        }
                    }
                },
                { $project: { _id: 1, Patient: 1, Docter: 1, Date: 1, Time: 1, isCompleted: 1, ConsultationNotes: 1, PatientAudio: 1, PatientFile: 1, createdAt: 1 } }
            ]);
            const activeAppointments = Collection.filter(appointment => !appointment.isCompleted);

            // console.log("total active appointments today:", activeAppointments);
            const totalAppointment = Collection.length;



            // console.log("totalAppointment", totalAppointment);
            console.log("totalcollection", Collection);
            const getCurrPatient = await getcurQueue(req.docterId);
            console.log("getCurrPatient", getCurrPatient);
            io.emit("totalPatient", totalAppointment);

            return res.status(200).json({ totalAppointment, currPatient: getCurrPatient });//only active appointments
        }
        catch (err) {
            console.log("error abc", err);
            return res.status(500).json({ message: "docter not found" })
        }


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
