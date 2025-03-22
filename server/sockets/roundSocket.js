import { randomInt } from "crypto"; 
import Rounds from "../models/roundModel.js";
import Bets from "../models/betModel.js";
import Others from "../models/otherModels.js";
export class RoundSocket {
    constructor(port,io) {
        this.port = Number(port);
        this.io = io;
       
        this.others = new Others();
        this.round = new Rounds();
        this.bet = new Bets();
        this.set_timer();
        this.rSocketEvents();

        console.log(`RoundSocket initialized on port: ${this.port}`);
        console.log(`Type of port: ${typeof this.port}`);  // DEBUGGING LINE

        // Ensure port is an integer
        // this.port = Number(this.port);  

        // if (this.port === 3000) {
        //     console.log("✅ Starting set_timer() since port is 3000");
        //     this.set_timer();
        // } else {
        //     console.log(`⛔ Skipping set_timer() on port: ${this.port}`);
        // }
    
      

    }

  
    

    

    rSocketEvents() {
        this.io.on('connection', (socket) => {
            console.log(`A user connected on port ${this.port}`);
            

            socket.on("pastWinners", async () => {
                console.log("Req past winners: ");
                await this.past_winners();
            });
        });

        // this.startRoundProcess();
    }

    // startRoundProcess() {
    //     // Start timer and round process only for each individual socket
    //     if (this.port === 3000) {
    //         this.set_timer();
    //     }
    
        
       
  


    
    async set_timer() {
        // console.log("Starting set_timer() on port:", this.port);
        // console.log("🚀JGJXJDHDIRHIR set_timer() function is running...");

        // if (this.port === 3000) {
        //     console.log("/ Starting set_timer() since port is 3000");
            
        // }else {
        //     console.log(`⛔ Skipping set_timer() on port: ${this.port}`);
        // }

       
        let mins = 1;
        let secs = mins * 60 * 1000;
        let latestRound = await this.round.get_roundNum()
        console.log("last round", latestRound);

     
        let gapTime = 5 * 1000;
        let round_num = latestRound > 0 ? latestRound + 1:1;
        console.log("RRROUND NUM: ", round_num);
        const prizePERwinner = 0;
        
        await this.round.start_Round(round_num);

        this.io.emit('roundNumber', round_num); 
     
        console.log("IO.EMIT ROUND NUM 1");
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.io.emit('timer-update', secs);
        
        console.log(`Rechecking winners for round: ${round_num}`);
        await this.past_winners();
        

     
       

        while (true) {
            let timeRemaining = secs;
            // this.io.emit('timer-update', timeRemaining);

            // this.io.emit('roundNumber', round_num); 
            // console.log("IO.EMIT ROUND NUM 2")
            
            

            while (timeRemaining > 0) {
                await this.updatePrize(round_num);
                
                this.io.emit('timer-update', timeRemaining);
                await new Promise(resolve => setTimeout(resolve, 1000));
                timeRemaining -= 1000;

                this.io.emit('roundNumber', round_num); 
            }

           
           
            let winning_number = this.generateWinningNumber();
            let date = new Date();

            try {
                await this.round.update_WinningNum(round_num,winning_number, date);
                await this.getWinner(round_num,winning_number );
                
            } catch (error) {
                console.error("Round creation error:", error.message);
            }

            for (let i = 1; i <= 5; i++) {
                this.io.emit('timer-update', -i * 1000); 
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

           

            round_num++;
            await this.round.start_Round(round_num);
            this.io.emit('roundNumber', round_num);
            console.log("🚀 New round started:", round_num);
    
            const prev = round_num - 1;
            // let winningNum_str = JSON.stringify(winning_number);
            const get_past = await this.bet.get_wins(winning_number, prev);
            console.log("debug: ", get_past);
            if (!get_past.length) {
                console.log(`No winners for round ${prev}, transferring prize to round ${round_num}.`);
                await this.round.update_prize(prev, round_num);
            } else {
                console.log(`Winners found for round ${prev}, prize remains.`);
            }




           
            console.log(`Rechecking winners for round: ${round_num}`);
            await this.past_winners();
        }
    }

    generateWinningNumber() {
        // let winning_number = [];
        // for (let i = 0; i < 3; i++) {
        //     winning_number.push(randomInt(0, 10)); 
        // }
        // console.log(`Winning numbers for this round are: ${winning_number.join(', ')}`);

        let win= [1,1,1]
    
        // this.io.emit('winning-numbers', win);
        // return win;
        let winningNum_str = JSON.stringify(win);
        console.log("WIN: ", winningNum_str);
        this.io.emit('winning-numbers', winningNum_str);
        return winningNum_str;
    }
    async updatePrize(roundNum) {
        try {
            const getPrize = await this.round.show_Prize(roundNum);
          

            if (getPrize.length > 0) {
                const prizeAmount = getPrize[0].prize_amount;
                // console.log("PRIZE AMT: ",prizeAmount)
                // console.log(`Prize for round ${roundNum}: ${prizeAmount}`);

                this.io.emit('prize-update', { round: roundNum, prize: prizeAmount });
            } else {
                console.log(`No prize found for round ${roundNum}`);
            }
        } catch (err) {
            console.error("Error fetching prize:", err);
        }
    }
    async getWinner(round_num, winning_num){
       
        
        
        try{
            const winningNumArr = Array.isArray(winning_num) ? winning_num: JSON.parse(winning_num);

            const userBets = await this.bet.get_bets(JSON.stringify(winningNumArr),round_num);
            console.log(`BETS FOR ${round_num}: `, userBets);
            console.log(`Winners for round ${round_num}:`, userBets);

            if(!userBets.length){
                console.log(`No bets placed for round ${round_num}`);
                
                this.io.emit('no-winner', { round: round_num });
                return;
            }



            const prizeData = await this.round.show_Prize(round_num);
            if (!prizeData.length) {
                console.log(`No prize found for round ${round_num}`);
                return;
            }
    
            const prizeAmount = prizeData[0].prize_amount;
            const prizePerWinner = prizeAmount / userBets.length;
            
            console.log("PRIZE per winner: ", prizePerWinner);

            
            this.prizePerWinner = prizePerWinner;

            // const status = await this.others.user_status(round_num, user_id)

            for (let winner of userBets) {
            // await this.bet.get_winner(winner.user_id); 
            this.io.emit('announceWinner', { round: round_num, user: winner.user_id });
            const prizeData = await this.bet.getPrize(winner.user_id, prizePerWinner);
            
            this.io.to(winner.user_id).emit('sendWinner',{
                message: `You won ${prizePerWinner} coins!`,
                data: prizeData


            });


            // this.io.emit('announceWinner', { round: round_num, user: winner.user_id, prize: prizePerWinner });
        }

        setTimeout(async () => {
            console.log(`Rechecking winners for round: ${round_num}`);
            await this.past_winners();
        }, 2000);

    

        }catch (err) {
            console.error("Error Getting winner:", err);
        }
    }
    async past_winners(){
        try{
            console.log("you called");

            const round_num = await this.round.get_roundNum();
            const prev = round_num - 1;
            const prev_winners = await this.others.get_past_winners(prev);

            console.log("PREV:", prev_winners);
            console.log("prev: ", prev);
           

            if (!prev_winners.length) {
                console.log(`No past winners for round ${prev}`);
            }
            this.io.emit("sendPrevWinners", {message: "Prev NUM SENT", prev_round:prev, data: prev_winners, prizeperwinner: this.prizePerWinner});

            
        }catch(err){
            this.io.emit("sendingWinnersError", {message: err.message});
        
    
    }





    }


}

export default RoundSocket;