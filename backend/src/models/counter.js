import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    docterDepartment: {
        type: String,
        required: true,
    },

    QueueNum: {
        type: Number,
        required: true,
    },
    lastResetDate: {
        type: String,
        default:new Date().toISOString().split("T")[0]
    },
    currentQueueNum:{
        type: Number,
        default:0

    }


});
const Counter = mongoose.model("Counter", counterSchema);
export { Counter };
