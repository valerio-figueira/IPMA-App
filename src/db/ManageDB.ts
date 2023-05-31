import mysql, { FieldInfo, packetCallback } from 'mysql';

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const HOST_NAME = process.env.HOST_NAME;

export default class ManageDB {

    createConnection() {
        return mysql.createConnection({
            host: HOST_NAME,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
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
                    if (err) reject(err);
                    else resolve(results);
                    
                    connection.end();
                });
            });
        });
    }

}