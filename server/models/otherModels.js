import { stat } from "fs";
import connection from "../config/db.js";


export class Others{
    constructor(){
        this.db = connection;
    }

    async getCoins(user_id){
        try{
            const [user] = await this.db.execute(
                "SELECT coins FROM users WHERE user_id= ?",
                [user_id]
            );

            return user;

        }catch(err){
            console.error('<error> Others.getCoins', err);
            throw err;
        }

    }

    async bet_history(user_id){
        try{
            const [history]= await this.db.execute(
                `SELECT 
                bets.round_id,
                bets.numbers,
                bets.coins AS bet_amount,
                bets.placed_at,
                bets.status,
                prizes.prize_amount
                FROM bets
                LEFT JOIN prizes ON bets.round_id = prizes.round_id
                WHERE bets.user_id = ?
                ORDER BY bets.placed_at DESC `, 
                [user_id]

            );

            return history;
        }catch (error) {
            console.error("Error fetching bet_history:", error);
            throw error;
        }
    }

    async get_past_winners(round_id){
        try{
            const [winners] = await this.db.execute(
                `SELECT
                    rounds.round_id,
                    users.user_name,
                    bets.numbers AS bet_numbers,
                    rounds.winning_numbers,
                    prizes.prize_amount,
                    rounds.draw_time
                FROM bets 
                JOIN users ON bets.user_id = users.user_id
                JOIN rounds ON bets.round_id = rounds.round_id
                LEFT JOIN prizes ON prizes.round_id = rounds.round_id
                WHERE bets.status = 'Won' AND bets.round_id = ?
                ORDER BY rounds.draw_time DESC`,
                [round_id]
            );

            console.log("PREV WINNERS(MODELS):", winners);
            return winners;
        } catch (error) {
            console.error("Error fetching past winners:", error);
            throw error;
        }
    }

    async get_userProfile(user_id){
        try{
            const [profile] = await this.db.execute(
                "SELECT * FROM users WHERE user_id = ?",
                [user_id]
            );

            return profile;

        }catch (error) {
            console.error("Error fetching past winners:", error);
            throw error;
        }

    }

    async deposit_coins(user_id){

        try{

            const deposit = await this.db.execute(
                "UPDATE users SET coins = ? WHERE user_id = ?  ",
                [0, user_id]
            );
            
        }catch(err){
            console.error('<error>Others.deposit_coins', err);
            throw err;
        }

    }

    async user_status(round_num, user_id){
        try{

            const [status] = await this.db.execute(
                "SELECT * FROM bets WHERE round_id = ? AND  user_id= ? AND status = 'Won' ",
                [round_num, user_id]
            );

            return status;
            
        }catch(err){
            console.error('<error>Others.deposit_coins', err);
            throw err;
        }
    }


}

export default Others;

