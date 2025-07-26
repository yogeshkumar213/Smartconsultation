import express from 'express';
import mongoose from 'mongoose';
const appointmentSchema = new mongoose.Schema({
    Patient: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    Docter: {
        type: String,
    },
    Date: {
        type: Date,
    },
    Time: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    PatientAudio: {
        type: String,
       
    },
    PatientFile: {
        type: [String],
         default:[]
    }
});
const Appointment = mongoose.model('Appointment', appointmentSchema);


export { Appointment };