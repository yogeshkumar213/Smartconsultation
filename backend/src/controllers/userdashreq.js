import { User } from '../models/user.js';
import { Docter } from "../models/docter.js";
import { Appointment } from '../models/appointment.js';
import jwt, { decode } from 'jsonwebtoken';
import mongoose from 'mongoose';
import status from "http-status"

import { io } from '../../app.js';
import dotenv from "dotenv";
dotenv.config();


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("connected to mongodb"))
        .catch((err) => console.log(err));

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled

}
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


const appointment = async (req, res) => {
    console.log("take appointment");
    console.log("reqbody is ", req.body);
    try {
        const file = req.files;
        const patientFile = file.PatientFile;
        const audioFile = file.PatientAudio;
        // console.log(patientFile)
        // console.log(audioFile);
        const { Patient, Docter, Date, Time } = req.body;
        console.log("Patient id is", Patient);

        const patientAppointData = await Appointment.create({
            Patient: Patient,
            Docter: Docter,
            Date: Date,
            Time: Time,
            // PatientAudio: audioFile,
            PatientFile: patientFile
        })

        console.log(patientAppointData);
        const totalAppointmenttoday=await Appointment.countDocuments({Docter:Docter});
        console.log(totalAppointmenttoday);
        io.emit("totalPatient",totalAppointmenttoday);
        
        return res.status(200).json({ message: "patient appointment booked" })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something is wrong ", err })
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



export { getDocterList, getappointTime, appointment, getuserprofile, updateuserdata, patdel }