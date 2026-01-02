// socket.js
import { io } from "socket.io-client";

export const socket = io("https://smartconsultation-l9fa.vercel.app/",{
    autoConnect: false,
});


