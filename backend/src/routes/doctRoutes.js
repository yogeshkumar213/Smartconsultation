import express from "express";
const router = express.Router();
import dotenv from "dotenv";
import { Docter } from "../models/docter.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { Appointment } from "../models/appointment.js";
dotenv.config();

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
            return res.status(200).json({message:"user found",allAppointments})
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

export default router;
