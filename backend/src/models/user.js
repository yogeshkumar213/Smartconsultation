import express from 'express';
import mongoose from 'mongoose';


let userData = new mongoose.Schema({
    UserName: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Phoneno: {
        type: String,
        required: true
    },
    Appointment:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Appointment'
    }
})
const User=mongoose.model("User",userData);
export {User};
