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
    ConsultationNotes: {

        Symtoms: String,
        ProbableCause: String,
        PrescribedMedications: String,
        TreatmentAdvice: String,
        FollowUpSuggestions: String,
        UploadedReport: [{
            key: { type: String, required: true },
            mimetype: { type: String, required: true }
        }],
        consultedAt: {
            type: Date,


        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    PatientAudio: {
        type: {
            key: String,
            mimetype: String
        },

    },
    PatientFile: {
        type: [{
            key: String,
            mimetype: String
        }],
        default: []
    },
    isCompleted: {
        type: Boolean,
        default: false
    }

});
const Appointment = mongoose.model('Appointment', appointmentSchema);


export { Appointment };