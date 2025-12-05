import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    _id: {
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
    }

});
const Counter = mongoose.model("Counter", counterSchema);
export { Counter };
