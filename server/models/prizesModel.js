import  connection  from "../config/db.js";


export class Prizes{
    constructor(){
    this.db= connection;
    }
    
    async claim_coins(user_id) {
        try {
            const [get_coins] = await this.db.execute(
                "SELECT coins FROM users WHERE user_id=?",
                [user_id]
            );
    
            if (!get_coins.length) {
                throw new Error("User not found");
            }
    
            const total = get_coins[0].coins + 20;
    
            console.log(`💰 User ${user_id} has ${get_coins[0].coins} coins. Adding 20. New total: ${total}`);
    
            const [result] = await this.db.execute(
                "UPDATE users SET coins=? WHERE user_id=?",
                [total, user_id]
            );
    
            if (result.affectedRows === 0) {
                throw new Error("Failed to update coins");
            }
    
            console.log(`✅ Coins updated successfully for user ${user_id}. New balance: ${total}`);
    
            return total;
        } catch (err) {
            console.error("<error> Prizes.claim_coins:", err);
            throw err;
        }
    }
    async buy_coins(user_id, amount) {
        try {
            const [get_coins] = await this.db.execute(
                "SELECT coins FROM users WHERE user_id=?",
                [user_id]
            );
    
            if (!get_coins.length) {
                throw new Error("User not found");
            }
    
            const total = get_coins[0].coins + amount;
    
            console.log(`💰 User ${user_id} has ${get_coins[0].coins} coins. Adding 20. New total: ${total}`);
    
            const [result] = await this.db.execute(
                "UPDATE users SET coins=? WHERE user_id=?",
                [total, user_id]
            );
    
            if (result.affectedRows === 0) {
                throw new Error("Failed to update coins");
            }
    
            console.log(`✅ Coins updated successfully for user ${user_id}. New balance: ${total}`);
    
            return total;
        } catch (err) {
            console.error("<error> Prizes.claim_coins:", err);
            throw err;
        }
    }
    

    



}


export default Prizes;