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

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
dotenv.config();


// io.emit("msg","welocme in the zone")
// router.get("/test", (req, res) => {



// })
const router = express.Router();

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



    router.post("/getnextpatient", async (req, res) => {
        const { Patient, PatientAudio, PatientFile } = req.body.nextPatient;
        console.log("Patient,PatientAudio,PatientFile", Patient, PatientAudio, PatientFile);
        const findUser = await User.findOne({ _id: Patient });

        if (!findUser) {
            // User not found, return 404
            return res.status(404).json({ message: "Patient not found." });
        }
        console.log("findUser", findUser);
        // in future change this because searching past data on the basis of name is not a good way 
        const findAllPrevData = await Appointment.find({ Patient: findUser._id });



        if (findAllPrevData) {
            try {

                const prevReportAndDataPromises = findAllPrevData.map(async (prev) => {

                    if (!prev.PatientAudio || !prev.PatientFile) {
                        return null; // Skip if data is missing
                    }
                    const { PatientAudio, PatientFile } = prev;

                    const audio = await getAudioandReport(prev.PatientAudio);
                    const report = await getAudioandReport(prev.PatientFile[0]);
                    return {
                        appointmentId: prev._id,
                        date: prev.Date, // Include useful metadata
                        audioData: audio,
                        reportData: report
                    };

                })

                const prevReportAndData = await Promise.all(prevReportAndDataPromises);
                res.status(200).json({ message: "data successfully fetched", nextUser:findUser, prevAndCurrReportAndAudioData: prevReportAndData.filter((prev) => prev !== null) });
            }
            catch (err) {
                console.log(err);
                res.status(404).json({ message: "data was not found", err });
            }
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



    router.get("/api/appointments", verifyDocter, async (req, res) => {
        console.log("docterid:", req.docterId);
        try {
            const Collection = await Appointment.find({ Docter: req.docterId });
            const totalAppointment = Collection.length;
            // console.log(Collection);
            // console.log(totalAppointment);
            // await Appointment.countDocuments({Docter:req.docterId});

            console.log("totalAppointment", totalAppointment);
            console.log("totalcollection", Collection);
            return res.status(200).json({ totalAppointment, Collection })
        }
        catch (err) {
            return res.status(500).json({ message: "docter not found" })
        }

        io.emit("totalPatient", totalAppointment);
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
