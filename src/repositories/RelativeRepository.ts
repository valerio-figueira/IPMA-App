import ManageDB from "../db/ManageDB";

export default class RelativeRepository {
    manageDB: ManageDB;

    constructor() {
        this.manageDB = new ManageDB();
    }

    async Create(query: any) { }

    async ReadAll(holder: string) {
        return this.manageDB.createQuery(`SELECT * FROM DEPENDENTES WHERE id_titular=${holder}`);
    }

    async ReadOne(holder: string, relative: string) {
        return this.manageDB.createQuery(`SELECT * FROM DEPENDENTES WHERE id_titular=${holder} AND id_dependente=${relative}`);
    }

    async Update() { }

    async Delete() { }

}