import { Docter } from "../models/docter.js";
import { User } from '../models/user.js';
import { Appointment } from "../models/appointment.js";
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import status from "http-status"

import dotenv from "dotenv";
import { get } from "http";
dotenv.config();


main();

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to mongodb");
    }

    catch (err) {
        console.log(err)
    }



    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled

}


// async function appoint() {
//     const deletedAppoint = await Appointment.deleteMany({});
//     console.log(deletedAppoint);
// }
// appoint();

const isAuthenticated = ((req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log("middleware is called");
        console.log(token);
        console.log(authHeader);

        if (!token) {
            return res.status(401).json({ message: "Access token is not found" })
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "invalid or expired token" })
            }
            else {
                console.log("decode", decoded)
                req.user = decoded;
                next();
            }

        })
    }
    catch (err) {
        console.log(err);
    }


});
const verifyDocter = (req, res, next) => {
    console.log("verifyDocter middleware called");
    const token = req.headers.doctoken;
    console.log("doctoken", token);
    if (!token) {
        return res.status(404).json({ message: "token not found" })
    }
    try {

        const decode = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(decode);
        // console.log("vrify docter", decode);
        req.docterId = decode.DocterId;
        next();
    }
    catch (err) {
        return res.status(404).json({ message: "token unathorized", err })
    }

}












let usersignup = async (req, res) => {
    console.log("user signup")
    try {
        let { UserName, Password, Email, Phoneno } = req.body;
        console.log(UserName);

        let existUser = await User.findOne({ UserName: UserName });
        if (existUser) {
            console.log(existUser);
            return res.status(409).json({ message: "user already exist", existUser });

        }



        let newPass = await bcrypt.hash(Password, 10);

        let data = await User.create({
            UserName: UserName,
            Password: newPass,
            Email: Email,
            Phoneno: Phoneno

        })
        console.log(data);
        const token = jwt.sign({
            Email: Email,
            UserName: UserName,
            // Password: Password
        }, process.env.SECRET_KEY, { expiresIn: "1h" });
        console.log(token);

        console.log("user registered successfully")
        res.status(201).json({ message: "user registered successfully", data, token })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "internal server error", error: err })
    }

}
let userLogin = async (req, res) => {
    const { Password, Email } = req.body;
    console.log(Email);
    console.log(Password)

    try {
        const existUser = await User.findOne({ Email: Email })
        if (!existUser) {
            console.log("result sended ")
            return res.status(401).json({ message: "email is not exist" })

        }
        console.log("req come in backend in user login");
        console.log(existUser);
        const isMatch = await bcrypt.compare(Password, existUser.Password);
        if (!isMatch) {
            console.log("Invalid password")
            return res.status(401).json({ message: "Invalid password" })
        }

        const token = jwt.sign({
            Email: Email,
            UserName: existUser.UserName,
        }, process.env.SECRET_KEY, { expiresIn: "1min" });

        console.log(token);
        console.log("user found ");


        const refreshToken = jwt.sign({
            Email: Email
        }, process.env.REFRESH_TOKEN_SECRET);


        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "Strict",
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.status(200).json({ message: "user found", token, existUser })
    }
    catch (err) {
        console.log(err);
        return res.status(501).json({ message: "some another issue" })
    }
}


const refreshAccessToken = async (req, res) => {
  console.log("refreshAccessToken called");

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Refresh token not found" });
  }

  const refreshToken = cookies.jwt;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      console.error("JWT verification failed:", err);
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    try {
      const existUser = await User.findOne({ Email: decoded.Email });

      if (!existUser) {
        return res.status(403).json({ message: "User not found" });
      }

      const token = jwt.sign(
        {
          Email: existUser.Email,
          UserName: existUser.UserName,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ message: "Access token refreshed", token });
    } catch (dbErr) {
      console.error("Error fetching user:", dbErr);
      return res.status(500).json({ message: "Server error during token refresh" });
    }
  });
};




let doctersignup = async (req, res) => {
    try {
        let { DocterName, Password, Email, Specilization, Licenseno } = req.body;
        // console.log(DocterName);

        let existDocter = await Docter.findOne({ DocterName: DocterName });
        if (existDocter) {
            console.log(existDocter)
            return res.status(499).json({ message: "Docter already exist", existDocter })

        }


        const newPass = await bcrypt.hash(Password, 10);

        let data = await Docter.create({
            DocterName: DocterName,
            Password: newPass,
            Email: Email,
            Specilization: Specilization,
            Licenseno: Licenseno

        })
        console.log(data);

        const token = jwt.sign({
            DocterName: DocterName,
            DocterId: data._id,
            Email: Email,
            Specilization: Specilization,
            Licenseno: Licenseno
        }, process.env.SECRET_KEY, { expiresIn: "24h" });
        console.log(token);

        return res.status(201).json({
            message: "docter registered successfully", token, data: {
                docterName: data.DocterName,
                Licenseno: data.Licenseno
            }
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "internal server error", error: err })
    }

}

const docterLogin = async (req, res) => {
    try {
        console.log("login");

        const { Password, Email, Licenseno } = req.body;
        console.log("Password from request:", Password);

        console.log(Email);

        const existDocter = await Docter.findOne({
            Email: Email,
            Licenseno: Licenseno
        });
        console.log(existDocter)
        if (!existDocter) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const isMatch = await bcrypt.compare(Password, existDocter.Password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            {
                DocterName: existDocter.DocterName,
                DocterId: existDocter._id,
                Email: existDocter.Email,
                Specilization: existDocter.Specilization,
                Licenseno: existDocter.Licenseno

            },
            process.env.SECRET_KEY,
            { expiresIn: "24h" },
        );
        console.log("sending response to frontend")
        return res.status(200).json({
            message: "Doctor successfully logged in",
            // existDocter,
            doctoken: token
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { userLogin, doctersignup, usersignup, docterLogin, isAuthenticated, verifyDocter, refreshAccessToken };


