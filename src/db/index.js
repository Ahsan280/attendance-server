import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectTimeout: 10000,
  port: process.env.DATABASE_PORT,
});

export default connection;
