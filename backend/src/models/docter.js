import express from 'express';
import mongoose from 'mongoose';
import { Appointment } from './appointment.js';

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://yogesh:yogesh7544@cluster0.zmnnk.mongodb.net/Preconsultation');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled

}

let docterData = new mongoose.Schema({
    DocterName: {
        type: String,
        requered: true,

    },
    Password: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Specilization: {
        type: String,
        enum: ["General Physician", "Cardiologist", "Dermatologist", "Neurologist", "Pediatrician"],
        required: true
    },
    Licenseno: {
        type: Number,
        enum: [121, 131, 141, 151, 161],
        required: true

    },
    Appointment: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Appointment'
    }

})
let data = {
    DocterName: "yogesh",
    Password: "1234",
    Email: "x19yogesh@gmail.com",
    Specilization: "Cardiologist",
    Licenseno: 323
}
const Docter = mongoose.model("Docter", docterData);
// let data2 = async () => {
//    let addData= await Docter.insertOne(data);
//    console.log(addData)
//    let delData= await Docter.deleteMany({});
//    console.log(delData);


// };
// data2()




export { Docter };