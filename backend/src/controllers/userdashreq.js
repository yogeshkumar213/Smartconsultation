import { Docter } from "../models/docter.js";
import { User } from '../models/user.js';

import fs from 'fs';
import jwt from 'jsonwebtoken';
import mime from "mime-types";
import path from 'path';
import { uuid } from 'uuidv4';
import { fileURLToPath } from 'url';
import { Appointment } from '../models/appointment.js';
import { Counter } from "../models/counter.js";

// 👇 Simulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import dotenv from "dotenv";

import mongoose from "mongoose";
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



const getCurrQueueNum = async (req, res) => {

    try {
        const { docterDepartment } = req.body;
        console.log("docterDepartment in getCurrQueueNum", docterDepartment);

        // Fetch all counters for requested departments
        const counters = await Counter.find({
            docterDepartment: { $in: docterDepartment }
        });

        console.log("counters in getCurrQueueNum", counters);

        const result = {};

        docterDepartment.forEach(dept => {
            const counter = counters.find(
                c => c.docterDepartment === dept
            );

            if (!counter || counter.currentQueueNum === 0) {
                result[dept] = null; // waiting / not started
            } else {
                result[dept] = counter.currentQueueNum;
            }
        });

        res.status(200).json({
            message: "current queue number fetched successfully",
            result
        });

    } catch (error) {
        console.error("Error in getCurrQueueNum:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }

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

    let counterDoc = await Counter.findOne({ docterDepartment });
    const todayDate = new Date().toISOString().split("T")[0];
    // Try to find the counter document for this department if the date is not matching today date then reset the date means now queueNum start from 1
    if (!counterDoc || counterDoc.lastResetDate != todayDate) {
        //then reset the date
        counterDoc = await Counter.findOneAndUpdate(
            { docterDepartment },
            {
                $set: {
                    QueueNum: 1,
                    lastResetDate: todayDate

                },

            },
            { new: true, upsert: true }
        )
        return 1;

    }
    else {
        const counter = await Counter.findOneAndUpdate(
            { docterDepartment },
            { $inc: { QueueNum: 1 } },// $inc prevent from race condition $inc operater is an atomic operater
            { new: true, upsert: true }//upsert: true ka matlab: Agar document exists nahi karta → automatically create kar do.

        )
        return counter.QueueNum;

    }

}
const getAllUpcomingAppointment = async (req, res) => {
    try {
        console.log("req", req.user);
        const Patient = req.user.PatientId;
        console.log("Patient id is", Patient);

        const appointments = await Appointment.find({ Patient, isCompleted: false }).populate("Docter");
        const appointment = appointments.map((a) => ({
            Docter: a.Docter.DocterName,
            specilization: a.Docter.
                Specilization,
            queueNum: a.QueueNum,
            Date: a.Date,
            Time: a.Time
        }));
        console.log("appointment", appointment);
        res.status(200).json({ message: "Appointment Successfully Booked", appointment })
    }
    catch (err) {
        console.log("facing an issue while fetching upcoming appointment", err);
        res.status("500").json({ message: "facing an issue while fetching upcoming appointment", err })
    }


}
const appointment = async (req, res) => {
    const patientToken = req.headers.authorization.split(" ")[1];

    console.log("headers",);
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
const stringToMinute = (slot) => {
    const [time, period] = slot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period == "AM" && hours === 12) {
        hours = 0;
    }
    else if (period == "PM" && hours != 12) {
        hours += 12;
    }
    return hours * 60 + minutes;
}
const getIstDate = async (date) => {
    const utcDate = new Date(date);
    const addextraTime = 5.5 * 60 * 60 * 1000;
    const istTime = utcDate.getTime() + addextraTime;
    return new Date(istTime);
}
const getLocalISODateString = (dateObj) => {
    return dateObj.toLocaleDateString('sv-SE');
};
const getAvailableSlot = async (Docter, dateString, appointTime) => {//jo datestring client se aa rhi hai wo UTC mai aa rhi hai or mera new Date IST mai date ko generate karta hai 

    const utcToIst = await getIstDate(dateString);
    console.log("utctoist", utcToIst);
    const docterId = new mongoose.Types.ObjectId(Docter);

    const startOfDay = new Date(utcToIst);

    startOfDay.setHours(0, 0, 0, 0);
    console.log("Start of day", startOfDay);
    const endOfDay = new Date(utcToIst);
    endOfDay.setHours(23, 59, 59, 999);
    const findSlot = await Appointment.find({
        Docter: docterId,
        isCompleted: false,
        Date: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    }).select('Time -_id').exec();
    console.log("findSlot", findSlot); //[{ Time: '09:00 AM' }, { Time: '03:30 PM' }]	An array of objects, where each object has a property named Time.

    const now = new Date();
    console.log("now date", now.toISOString().split("T")[0])
    const isToday = getLocalISODateString(now) === getLocalISODateString(startOfDay);
    const currMinutes = now.getHours() * 60 + now.getMinutes();



    const bookedTimes = findSlot.map((appointment) => appointment.Time);//This ensures that your bookedTimes is a clean list of strings, like ['09:00 AM', '03:30 PM']
    const availableSlot = appointTime.filter((slot) => {
        const isNotBooked = !bookedTimes.includes(slot)
        let isFutureTime = true;
        if (isToday) {
            const slotMinutes = stringToMinute(slot);
            isFutureTime = slotMinutes > currMinutes;
        }
        return isNotBooked && isFutureTime
    })
    return availableSlot;

    // const findSlot = await Appointment.aggregate([
    //     {
    //         $match: {
    //             Docter: docterId,
    //             isCompleted: false,
    //             $expr: {
    //                 $eq: [
    //                     {
    //                         $dateToString: { format: "%Y-%m-%d", date: "$Date", timezone: "Asia/Kolkata" }
    //                     }, extractedDate
    //                 ]

    //             }
    //         }
    //     },
    //     { $project: { TimeSlot: "$Time" } }
    // ]);
    // console.log("findSlot", findSlot);


}

const getappointTime = async (req, res) => {
    const dateString = req.body.Date;
    const Docter = req.body.Docter;
    console.log("dateString and Docter", dateString, Docter);
    const appointTime = ["09:00 AM",
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
        "04:30 PM",
        "05:00 PM",
        "05:30 PM",
        "06:00 PM",
        "09:00 PM",
        "10:00 PM"
    ]


    const availableSlot = await getAvailableSlot(Docter, dateString, appointTime);
    console.log(availableSlot);
    try {
        console.log("request for time is came")

        return res.status(200).json({ message: availableSlot });
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



export { appointment, getappointTime, getDocterList, getuserprofile, patdel, updateuserdata, getAllUpcomingAppointment, getCurrQueueNum };

