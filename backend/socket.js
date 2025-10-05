import {verifyToken} from "./utils/jwt.js";
import userModel from "./models/userModel.js";

export const socketHandler = (io) => {
    io.on("connection", async (socket) => {
        const token = socket.handshake.auth.token;
        const userId = verifyToken(token);

        if (!userId) {
            socket.disconnect(); // kick out if invalid token
            return;
        }
        try {
            await userModel.findByIdAndUpdate(userId, {
                socketId: socket.id,
                isOnline: true
            });
        } catch (err) {
            console.log(err);
            socket.disconnect();
            return;
        }

        console.log("User connected:", userId, socket.id);

        // handle disconnect
        socket.on("disconnect", async () => {
            try {
                await userModel.findOneAndUpdate({ socketId: socket.id }, {
                    socketId: null,
                    isOnline: false
                });
            } catch (err) {
                console.log(err);
            }
            console.log("User disconnected:", userId);
        });
    });
};
