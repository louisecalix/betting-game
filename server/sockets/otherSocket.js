
import Others from "../models/otherModels.js";
import Rounds from "../models/roundModel.js";


export class OtherSocket{
    constructor(socket,io){
        this.io = io;
        this.socket = socket;
        this.others = new Others();
        this.round = new Rounds();

        this.oSocketEvents();

    }

    oSocketEvents(){

        console.log(`User connected to Othert: ${this.socket.user_id}`);
        if (!this.socket.user_id) {
            console.error("User authentication failed");
            this.socket.disconnect();
            return;
        }

        this.socket.on("userCoins", async() =>{
            console.log(`userCoins resquest received from user ${this.socket.user_id}  `);
            await this.getUserCoins();
        });

        this.socket.on("deposit", async()=>{
            console.log("DEPOSIT REQ RECEIVED");
            await this.depositCoins();

        });

        this.socket.on("userBetHistory", async()=>{
            console.log("req bt history");
            await this.getBetHistory();
        });
        this.socket.on("userProfile", async()=>{
            console.log("req user profille: ");
            await this.getUserProfile();

        });

       


    }

    async getUserCoins(){
        const user_id = this.socket.user_id;
        console.log("userid:",user_id);

        
        if (!user_id) {
            return this.socket.emit("getCoinsError", { message: "User ID is required" });
        }
        let lastCoins = null; 


        while (this.socket.connected) { 
        try{

            const user_coins = await this.others.getCoins(user_id);
            if (!user_coins || user_coins.length === 0) {
                console.warn(`No coins found for user: ${user_id}`);
                return;
            }

            const newCoins = user_coins[0].coins;
            
            if (newCoins !== lastCoins) {
                console.log(`Coins updated for user ${user_id}: ${newCoins}`);

                this.socket.emit("sendUserCoins", {
                    message: "User Coins updated",
                    coins: newCoins,
                });

                lastCoins = newCoins; // Update stored value
            }
        }catch(err){
            this.socket.emit("sendingError", {message: error.message});
        }
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before checking again
    }
        

    }

    async getBetHistory(){
        const user_id = this.socket.user_id;
        try{
            const betHistory = await this.others.bet_history(user_id);

            console.log("BET HISTORY:",  betHistory);

            this.socket.emit("sendBetHistory", {message: "Bet History sent", data: betHistory});
    }catch(err){
        this.socket.emit("sendingBetError", {message: err.message});
    

}}

    async getUserProfile(){
        const user_id = this.socket.user_id;

        try{

            const profile = await this.others.get_userProfile(user_id);
            console.log(profile);

            this.socket.emit("sendProfile",{message: "Profile sent", data: profile[0]});

        }catch(err){
            this.socket.emit("sendingProfileError", {message: err.message});
        
    
    }
    }

    async depositCoins(){
        const user_id = this.socket.user_id;

        try{

            const deposit = await this.others.deposit_coins(user_id);

            this.socket.emit("coinsDeposited", {message: "Deposited", coins : 0});

        }catch(err){
            this.socket.emit("depositError", {message: err.message});
        
    
    }
    }







    // async past_winners(){
    //     try{

    //         const round_num = await this.round.get_roundNum();
    //         const prev = round_num - 1;
    //         console.log("prev: ", prev);
           
    //         const prev_winners = await this.others.get_past_winners(prev);

    //         console.log("PREV:", prev_winners);
    //         this.socket.emit("sendPrevWinners", {message: "Prev NUM SENT", prev_round:prev,data:prev_winners});;

            
    //     }catch(err){
    //         this.socket.emit("sendingWinnersError", {message: err.message});
        
    
    // }









}

export default OtherSocket;