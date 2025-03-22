import  connection  from "../config/db.js";
import { encrypt_Password } from "../utils/encrypt.js";

export class User{
    constructor(){
        this.db = connection;
    }

    async createUser(user_name, email, password,birthdate, contact_num){
        try{

            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailRegex.test(email)) {
            throw new Error("Invalid email format.");
        }
            const encryptedPassword = encrypt_Password(password); 
            const [result] = await this.db.execute(
                "INSERT INTO users (user_name, email, password, birthdate, contact_num) VALUES (?, ?, ?, ?, ?)",
                [user_name,  email, encryptedPassword,birthdate, contact_num ]

            );

            const user_id = result.insertId;  
            console.log(user_id);
            return user_id;

        }catch(err){
            console.error('<error> User.createUser', err);
            throw err;
        }
        }

    async log_In(email,password){
        try{

            const verif_pw = await encrypt_Password(password);
            const[result]= await this.db.execute(
                "SELECT * FROM users WHERE email = ? AND password = ?",
                [email, verif_pw]
            );
            const acc = result[0];
            console.log(acc)

            if (!acc){
                return null;
            }
            return acc;

            
        }catch(err){
            console.error('<error> User.verify', err);
            throw err;
         }
    }
}

export default User;
