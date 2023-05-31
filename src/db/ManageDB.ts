import mysql from 'mysql';

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const HOST_NAME = process.env.HOST_NAME;

export default class ManageDB {
    
    static createSQLConnection() {
        const connection = mysql.createConnection({
            host: HOST_NAME,
            database: DB_NAME,
            user: DB_USER,
            password: DB_PASSWORD
        });
    
        return connection;
    }


}