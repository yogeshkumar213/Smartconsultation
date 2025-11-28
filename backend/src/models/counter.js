import mongoose from "mongoose";

const counterSchema=new mongoose.Schema({
    _id:String,
    queueNumber:Number
});
const Counter=mongoose.model("Counter",counterSchema);
export {Counter};
