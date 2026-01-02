// socket.js
import { io } from "socket.io-client";

export const socket = io("https://smartconsultation.onrender.com",{
    autoConnect: false,
});


