import User from "../models/accountModel.js";
import jwt from "jsonwebtoken";

console.log("user socket");

export class UserSocket {
    constructor(io) {
        this.io = io;
        this.userModel = new User();
    }

    handleSocket(socket) {
        console.log("User Connected", socket.id);

        socket.on("registerUser", async (data) => {
            await this.createAccount(socket, data);
        });

        socket.on("userLogIn", async (data) => {
            await this.logIn(socket, data);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
        });
    }

    async createAccount(socket, data) {
        const { user_name, email, password, birthdate, contact_num } = data;

        try {
            const result = await this.userModel.createUser(user_name, email, password, birthdate, contact_num);
            socket.emit("accountCreated", {
                message: "Account Created!",
                user_id: result.id,
                user_name,
                email,
                birthdate,
                contact_num,
            });

        } catch (error) {
            socket.emit("creationError", { message: error.message });
            console.error(error);
        }
    }

    async logIn(socket, data) {
        const { email, password } = data;

        try {
            const user = await this.userModel.log_In(email, password);
            console.log("CONSOLE LOG:USER ID:",user.user_id);
            const token = jwt.sign(
                { user_id: user.user_id, email: user.email },
                process.env.API_SECRET_KEY,
                { expiresIn: "7d" }
            );

            socket.emit("LoggedIn", { message: "Logged In",user_id: user.user_id,token });

        } catch (error) {
            socket.emit("logInError", { message: error.message });
            console.error(error);
        }
    }
}

export default UserSocket;
