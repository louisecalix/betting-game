import Bets from "../models/betModel.js";
import Others from "../models/otherModels.js";


export class BetSocket{
    constructor(io, socket){
        this.io = io;
        this.bets = new Bets;
        this.socket = socket;
        this.others = new Others();
        
         this.bSocketEvents();

    }

    bSocketEvents(){
        console.log(`User connected to BetSocket: ${this.socket.user_id}`);

        this.socket.on("getNumbers", async(data) =>{
            await this.getBetNums(this.socket, data);
        });

        this.socket.on("disconnect", () => {
            console.log("User disconnected", this.socket.id);
        });
        
    }


    async getBetNums(socket, data){
        const {num_one, num_two, num_three, round_id} = data;
        const user_id = this.socket.user_id;
        console.log("userid:",user_id);

        let betlist = [num_one, num_two, num_three];
        // const betList_str = JSON.stringify(betlist);
        // console.log('bet list: ',betList_str)

        if (!user_id){
            return this.socket.emit("bettingError", {message:"User id is required when betting"});
        }

        try{
            

            const coins = await this.others.getCoins(user_id);

            const userCoins = coins[0].coins;
            console.log(userCoins);
            if (userCoins < 20){
                console.log("if here");
                this.socket.emit("insufficientAmount", { message: "Insufficient Amount. Need 20 coins" });

            }

            else{

            
            const bet = await this.bets.bet_numbers(user_id, betlist, round_id);

            this.socket.emit("bettingSuccessful", {message: "Betted Successfully", data: bet});
            }
        }catch (error) {
            this.socket.emit("bettingError", { message: error.message });
            console.error(error);
        }



    }
}

export default BetSocket;