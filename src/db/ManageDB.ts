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

    static createQuery(query: string): any {
        const con = this.createSQLConnection();

        con.connect((error) => {
            if(error){
                throw new Error(`Ocorreu um erro: ${error}`);
            } else{
                const body = query;

                con.query(body, function (error: any, result: any) {
                    if(error){
                        con.end();
                        throw new Error(`Ocorreu um erro: ${error}`);
                    } else {
                        con.end();
                        return {
                            message: "",
                            body
                        };
                    };
                });
            };
        });
    }
}