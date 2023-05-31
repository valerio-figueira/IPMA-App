import UserRepository from "../repositories/UserRepository";

export default class UserService {
    userService: object;

    constructor() {
        this.userService = new UserRepository();
    }

    async Create() {}

    async ReadAll() {}

    async ReadOne() {}

    async Update() {}

    async Delete() {}


}