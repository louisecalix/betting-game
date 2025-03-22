import mysql from 'mysql2/promise';
import dotenv from "dotenv";

dotenv.config();

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
});

export default connection ;

// import mysql from "mysql2/promise";

// const connectDB = async () => {
//   try {
//     const connection = await mysql.createConnection({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASS,
//       database: process.env.DB_NAME,
//       port: process.env.DB_PORT || 3306,
//     });

//     console.log("✅ MySQL Connected Successfully!");
//     return connection;
//   } catch (error) {
//     console.error("❌ MySQL Connection Failed:", error.message);
//     process.exit(1); // Exit the process if the connection fails
//   }
// };

// export default connectDB;
