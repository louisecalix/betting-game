import Prizes from "../models/prizesModel.js";

export class PrizeSocket {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.prizeModel = new Prizes();
        
        this.pSocketEvents();
    }

    pSocketEvents() {
        console.log(`User connected to PrizeSocket: ${this.socket.user_id}`);

        if (!this.socket.user_id) {
            console.error("User authentication failed");
            this.socket.disconnect();
            return;
        }

        this.socket.on("claimCoins", async () => {
            console.log(`claimCoins event received from user ${this.socket.user_id}`);
            await this.claim_Coins();
        });

        this.socket.on("buyCoins", async(data)=>{

            await this.buy_Coins(data);

        });

        this.socket.on("disconnect", () => {
            console.log(`User ${this.socket.user_id} disconnected`);
        });
    }




    async buy_Coins(data) {
        const user_id = this.socket.user_id;
        console.log("userid:",user_id);

        const {amount}= data;

        if (!user_id) {
            return this.socket.emit("claimingError", { message: "User ID is required" });
        }

        try {
            console.log(`Processing coin claim for user ${user_id}`);
            const result = await this.prizeModel.buy_coins(user_id,amount);

          

            this.socket.emit("coinsBought", { message: "Coins bought successfully!", coins: result.total });
        } catch (error) {
            this.socket.emit("buyingError", { message: error.message });
        }
    }

    async claim_Coins() {
        const user_id = this.socket.user_id;
        console.log("userid:",user_id);

        if (!user_id) {
            return this.socket.emit("claimingError", { message: "User ID is required" });
        }

        try {
            console.log(`Processing coin claim for user ${user_id}`);
            const result = await this.prizeModel.claim_coins(user_id);

            // if (!result || typeof result.total !== "number") {
            //     return this.socket.emit("claimingError", { message: "Failed to update coin balance" });
            // }

            this.socket.emit("coinsClaimed", { message: "Coins claimed successfully!", coins: result.total });
        } catch (error) {
            this.socket.emit("claimingError", { message: error.message });
        }
    }
}

export default PrizeSocket;
