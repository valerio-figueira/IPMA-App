import ManageDB from "../db/ManageDB";

export default class RelativeRepository {
    constructor() { }

    async Create(query: any) { }

    async ReadAll(holder: string) {
        const con = ManageDB.createSQLConnection();

        con.connect((error) => {
            if (error) {
                throw new Error(`Ocorreu um erro: ${error}`)
            } else {
                con.query(`SELECT * FROM USUARIOS WHERE id=${holder}`, (error, result) => {
                    if (error) {
                        throw new Error(`Ocorreu um erro: ${error}`)
                    } else {
                        const user = result[0];

                        con.query(`SELECT * FROM DEPENDENTES WHERE id_titular=${holder}`, (error: any, result: any) => {
                            if (error) {
                                throw new Error(`Houve uma falha: ${error}`);
                            } else {
                                const relatives = result;
                                con.end();
                                return {
                                    userDetails: user,
                                    relatives
                                }
                            };
                        });
                    };
                });
            };
        });
    }

    async ReadOne(holder: string, relative: string) { }

    async Update() { }

    async Delete() { }

}