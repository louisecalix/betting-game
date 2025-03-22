
import  connection  from "../config/db.js";


export class Rounds{
    constructor(){
        this.db = connection;

    }

    async start_Round(round_num){

        try{

            const round = await this.db.execute(
                "INSERT INTO rounds(round_id) VALUES(?)",
                [round_num]
            );

            const [prize] = await this.db.execute(
                "INSERT INTO prizes(round_id) VALUES(?)",
                [round_num]
            );

            
            
            
            



        }catch(err){
            console.error('<error> Rounds.start_round', err);
            throw err;
    
    }

    }
    async update_WinningNum( round_num,winning_number, drawtime){
        try{

            const result = await this.db.execute(
                "UPDATE rounds SET winning_numbers=?, draw_time= ? WHERE round_id =?",
                [winning_number, drawtime, round_num]
            );

            const round_id = round_num;

            const get_round= await this.db.execute(
                "SELECT * FROM rounds WHERE round_id = ? ",
                [round_id]
            );
            return get_round;


        }catch(err){
            console.error('<error> Rounds.update_WinningNum', err);
            throw err;
    
    }
}

    async get_roundNum(){
        try{
            const [get_round] = await this.db.execute(
                "SELECT * FROM rounds ORDER BY round_id DESC LIMIT 1"
            );
            if (!get_round.length) {
                return 0;
            }

            const roundId = get_round[0].round_id;
            console.log(roundId);

            return roundId;
            
        }catch(err){
            console.error('<error> Rounds.get_roundNum', err);
            throw err;
    
    }
    }
    async show_Prize(rounNum){

        try{

            const [getPrize ]= await this.db.execute(
                "SELECT prize_amount FROM prizes WHERE round_id = ?",
                [rounNum]
            );

            // console.log("PRIZE: ", getPrize)

            return getPrize;


        }catch (err) {
            console.error("<error> Rounds.show_Prizes", err);
            throw err;
        }
    }
    async update_prize(past_round_id, curr_round_id){
        try{
            const [past_prize] = await this.db.execute(
                "SELECT prize_amount FROM prizes WHERE round_id = ?",
                [past_round_id]
            );

            const prev_prize = past_prize[0].prize_amount;


            const [curr] = await this.db.execute(
                "SELECT prize_amount FROM prizes WHERE round_id = ?",
                [curr_round_id]
            );
            const curr_prize = curr[0].prize_amount;

            const total = prev_prize + curr_prize;

            const [prize] = await this.db.execute(
                "UPDATE prizes SET prize_amount=? WHERE round_id =? ",
                [total, curr_round_id]
            );

        }catch (err) {
            console.error("<error> Rounds.update_prize", err);
            throw err;
        }

    }
}

export default Rounds;