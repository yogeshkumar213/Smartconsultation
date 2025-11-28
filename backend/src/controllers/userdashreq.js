import { Docter } from "../models/docter.js";
import { User } from '../models/user.js';

import fs from 'fs';
import jwt from 'jsonwebtoken';
import mime from "mime-types";
import path from 'path';
import { uuid } from 'uuidv4';
import { fileURLToPath } from 'url';
import { Appointment } from '../models/appointment.js';

// 👇 Simulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import dotenv from "dotenv";
import { Counter } from "../models/counter.js";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });


console.log("key", process.env.AWS_ACCESS_KEY_ID);
console.log(process.env.SECRET_KEY)
// console.log("hello")
// console.clear();
// main().catch(err => console.log(err));

// async function main() {
//     await mongoose.connect(process.env.MONGO_URL)
//         .then(() => console.log("connected to mongodb"))
//         .catch((err) => console.log(err));

//     // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled

// }








const patdel = async (req, res) => {
    const token = req.headers.authorization;
    const newToken = token.split(" ")[1];
    if (!newToken) {
        return res.status(401).json({ message: "Authorization token missing" });
    }
    console.log(newToken);
    jwt.verify(newToken, process.env.SECRET_KEY, async (err, decoded) => {
        if (err) {
            console.log(err);
        } else {
            const { Email, UserName } = decoded;
            try {
                const userData = await User.findOneAndDelete({ Email: Email, UserName: UserName });
                if (!userData) {
                    res.status(404).json({ message: "user not found" })
                }
                console.log(userData);
                res.status(200).json({ message: "user successfully deleted", userData })
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ message: "internal server error" })
            }

        }
    })
}




const updateuserdata = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const patientId = req.headers.patientid
        // console.log(req.body);
        const user = await User.findOneAndUpdate({ _id: patientId }, { UserName: name, Email: email, Phoneno: phone }, { new: true }) //  returns updated doc
        console.log(user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //   console.log("updatedata"+user);
        res.status(200).json({ message: "user updated successfully", user });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "something is wrong" })
    }


}
const getuserprofile = async (req, res) => {
    console.log("getuserprofile");
    // res.status(200).json({message:"data found"});

    const token = req.headers['authorization'];
    console.log(token);
    if (token) {
        const filterToken = token.split(" ")[1];
        jwt.verify(filterToken, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                console.log('Token is invalid');
            } else {
                const { Email, UserName } = decoded;
                const userData = await User.find({ Email: Email, UserName: UserName }).select("-Password");
                console.log(userData);
                res.status(200).json({ message: "userfound", userData })
            }
        })



    } else {
        res.status(404).json({ message: "something is wrong in backend" })
    }



}
const getNextQueueNum = async (docterDepartment) => {
    const counter = await Counter.findOneAndUpdate(
        { _id: docterDepartment },
        { $inc: { queueNumber: 1 } },// $inc prevent from race condition
        { new: true, upsert: true }//upsert: true ka matlab: Agar document exists nahi karta → automatically create kar do.

    )
    return counter.queueNumber;
}
const getAllUpcomingAppointment = async (req, res) => {
    try {
        console.log("req", req.user);
        const Patient = req.user.PatientId;

        const appointments = await Appointment.find({ Patient, isCompleted: false }).populate("Docter");
        const appointment = appointments.map((a) => ({
            Docter: a.Docter.DocterName,
            specilization: a.Docter.
                Specilization,
            queueNum: a.QueueNum,
            Date: a.Date,
            Time: a.Time
        }));
        res.status(200).json({ message: "Appointment Successfully Booked", appointment })
    }
    catch (err) {
        console.log("facing an issue while fetching upcoming appointment", err);
        res.status("500").json({ message: "facing an issue while fetching upcoming appointment", err })
    }


}
const appointment = async (req, res) => {
    // const patientToken=req.headers.authorization.split(" ")[1];

    // console.log("headers",);
    const { io } = await import('../../app.js');
    console.log("take appointment");
    console.log("reqbody is ", req.body);
    // try {
    const file = req.files
    // const patientfile = ["req.files",req.files.PatientFile];
    const PatientFile = file.PatientFile;
    const PatientAudio = file.PatientAudio?.[0];

    console.log("files are->", file);//image/png'
    console.log("PatientFile", PatientFile);
    // console.log(PatientAudio); //audio/wav
    const { Patient, Docter: docterId, Date, Time } = req.body;
    console.log("Patient id is", Patient);
    const config1 = {
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    }
    const client = new S3Client(config1);

    try {
        if (!PatientAudio && !PatientFile) {
            return res.status(400).json({ message: "No files uploaded" })
        }

        let uploadedFiles = [];
        let audioFileUrl = null;
        if (PatientFile && Array.isArray(PatientFile)) {


            uploadedFiles = await Promise.all(  // // Wait for all uploads to finish
                PatientFile.map(async (file) => {
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


                })
            )

        }

        if (PatientAudio) {
            // const audio = PatientAudio[0]
            const patientFileStream = fs.createReadStream(path.resolve(PatientAudio.path));
            const ext = mime.extension(PatientAudio.mimetype);
            const keyId = `${PatientAudio.filename}.${ext}`
            const input = {

                Bucket: "patientsensitivedata",
                Body: patientFileStream,
                Key: keyId,
                ContentType: PatientAudio.mimetype
            };
            await client.send(new PutObjectCommand(input));
            fs.unlink(PatientAudio.path, (err) => {
                if (err) {
                    console.log("err deleting files", err)
                }
            })

            audioFileUrl = {
                key: keyId,
                mimetype: PatientAudio.mimetype
            }

        }
        const docter = await Docter.find({ _id: docterId });
        const docterDepartment = docter[0].Specilization

        const getQueueNum = await getNextQueueNum(docterDepartment);


        const saveInDb = new Appointment({
            Patient: req.body.Patient,
            Docter: req.body.Docter,
            Date: req.body.Date,
            Time: req.body.Time,
            PatientFile: uploadedFiles,
            PatientAudio: audioFileUrl,
            QueueNum: getQueueNum,


        })
        const bookAppointment = await saveInDb.save();

        console.log(bookAppointment);
        // const totalAppointments = await Appointment.countDocuments({ Docter });

        const appointments = await Appointment.find({ Patient, isCompleted: false }).populate("Docter");
        const appointment = appointments.map((a) => ({
            Docter: a.Docter.DocterName,
            specilization: a.Docter.
                Specilization,
            queueNum: a.QueueNum,
            Date: a.Date,
            Time: a.Time
        })
        )
        // io.emit("totalPatient", totalAppointments);
        if (bookAppointment) {
            res.status(200).json({ message: "Appointment Successfully Booked", appointment })
        }

    }
    catch (err) {
        console.log("Error", err);
        res.status(500).json({ message: "internale server Error", error: err.message })
    }

}
const getappointTime = async (req, res) => {
    try {
        console.log("request for time is came")
        const appointDate = ["09:00 AM",
            "09:30 AM",
            "10:00 AM",
            "10:30 AM",
            "11:00 AM",
            "11:30 AM",
            "02:00 PM",
            "02:30 PM",
            "03:00 PM",
            "03:30 PM",
            "04:00 PM",
            "04:30 PM"]
        return res.status(200).json({ message: appointDate });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "backend issue", err: err })
    }

}
const getDocterList = async (req, res) => {
    console.log("for doctelist req is came")
    try {
        const docterList = await Docter.find({}).select("-Password -__v -Email -Licenseno");
        // console.log(docterList);
        res.status(200).json({ message: "docter list found", docterList: docterList })
    }
    catch (err) {
        res.status(500).json({ message: "fetching docter list form database face problem " })
    }

}



export { appointment, getappointTime, getDocterList, getuserprofile, patdel, updateuserdata, getAllUpcomingAppointment };

