import mysql, { FieldInfo, packetCallback } from 'mysql';
require('dotenv').config();


export default class ManageDB {
    DB_USER = process.env.DB_USER;
    DB_PASSWORD = process.env.DB_PASSWORD;
    DB_NAME = process.env.DB_NAME;
    HOST_NAME = process.env.HOST_NAME;

    createConnection() {
        return mysql.createConnection({
            host: this.HOST_NAME,
            user: this.DB_USER,
            password: this.DB_PASSWORD,
            database: this.DB_NAME,
        });
    }

    async createQuery(query: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const connection = this.createConnection();

            connection.connect((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                connection.query(query, (err: Error, results: packetCallback, fields: FieldInfo) => {
                    console.log(fields)
                    if (err) reject(err);
                    else resolve(results);

                    connection.end();
                });
            });
        });
    }

}