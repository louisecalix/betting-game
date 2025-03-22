import  connection  from "../config/db.js";

export class Bets{
    constructor(){
        this.db = connection;
    }

    async bet_numbers(user_id, numbers,round_id ){
        try{

            console.log("User ID:", user_id);
            console.log("Round ID:", round_id);
            console.log("Bet Numbers:", numbers);

            if (!Array.isArray(numbers) || numbers.length === 0) {
                throw new Error("Invalid bet numbers: Must be a non-empty array.");
            }
    
            const numbersStr = JSON.stringify(numbers); 
            console.log("NUMBERS:",numbersStr);
    
            const [result] = await this.db.execute(
                "INSERT INTO bets (user_id, numbers, round_id, status) VALUES (?, ?, ?, ?)",
                [user_id, numbersStr, round_id, "Pending"]
            );
    
            const bet_id = result.insertId;

            
            const get_bet = await this.db.execute(
                "SELECT * FROM bets WHERE user_id= ? AND bet_id = ?",
                [user_id, bet_id]
            );

            
            
            const userCoins = await this.db.execute(
                "SELECT coins FROM users WHERE user_id = ?",
                [user_id]
            );
            
            const roundId =  get_bet[0][0].round_id;
            console.log("rnd id: ", get_bet[0][0].round_id);

            const [curr_prize] =  await this.db.execute(
                "SELECT prize_amount FROM prizes WHERE round_id = ?",
                [roundId]
            );

            console.log("CURR PRIZE: ", curr_prize[0].prize_amount);

            const add_prize = curr_prize[0].prize_amount + 20;
            console.log("PRIZE NOW: ", add_prize)
            const prizePool= await this.db.execute(
                "UPDATE prizes SET prize_amount =? WHERE round_id=?",
                [add_prize, roundId]
            );

            

            

            const curr_coins = userCoins[0][0].coins - 20;
            console.log("coins: ",curr_coins);
            const updateCoins= await this.db.execute(
                "UPDATE users SET coins =? WHERE user_id=?",
                [curr_coins, user_id]
            );


            console.log(get_bet);
            return get_bet;
        }catch(err){
            console.error('<error> Bets.bet_numbers', err);
            throw err;
        }
    }

    async get_wins(winning_num, round_id) {
        try {
            const winningNumStr = JSON.stringify(JSON.parse(winning_num)); 
            const [bets] = await this.db.execute(
                "SELECT * FROM bets WHERE round_id = ? AND numbers = ?",
                [round_id, winningNumStr]
            );   
             return bets;
        } catch (err) {
            console.error("<error> Bets.get_wins", err);
            throw err;
        }
    }
    async get_bets(winning_num, round_id) {
        try {
            const winningNumStr = JSON.stringify(JSON.parse(winning_num)); 
            const [bets] = await this.db.execute(
                "SELECT * FROM bets WHERE round_id = ? AND numbers = ?",
                [round_id, winningNumStr]
            );
    
            console.log("Winners for round", round_id, ":", bets);
    
            if (bets.length > 0) {
              
                await this.db.execute(
                    "UPDATE bets SET status = 'Won' WHERE round_id = ? AND numbers = ?",
                    [round_id, winningNumStr]
                );
    
             
                await this.db.execute(
                    "UPDATE bets SET status = 'Lost' WHERE round_id = ? AND numbers != ?",
                    [round_id, winningNumStr]
                );
                // await this.db.execute(
                //     "UPDATE bets SET status = 'Lost' WHERE round_id = ? AND NOT JSON_CONTAINS(numbers, ?)",
                //     [round_id, winningNumStr]
                // );
                
            } else {
                console.log("No winners found for round:", round_id);
            }
    
            return bets;
        } catch (err) {
            console.error("<error> Bets.get_bets", err);
            throw err;
        }
    }


    

    // async get_winner(user_id){
    //     try{
    //         const [winner] = await this.db.execute(
    //             "UPDATE bets SET status = ? WHERE user_id=?",
    //             ['Won', user_id]
    //         );
    //          return winner;

    //     }catch(err){
    //         console.error('<error> Bets.get_winner', err);
    //         throw err;
    //     }
    // }

    async getPrize(user_id, prize){
        try{
            const [user] = await this.db.execute(
                "SELECT coins FROM users WHERE user_id= ?",
                [user_id]
            );
            console.log(user);

            const totalPrize = user[0].coins + prize;
            console.log(totalPrize);


            const [result]= await this.db.execute(
                "UPDATE users SET coins = ? WHERE user_id =? ",
                [totalPrize, user_id]
            );
        }catch(err){
            console.error('<error> Bets.getPrize', err);
            throw err;
        }
    }
}

export default Bets;