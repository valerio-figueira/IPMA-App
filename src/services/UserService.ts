import { IUser } from "../interfaces/IUser";
import UserSchema from "../model/UserSchema";
import UserRepository from "../repositories/UserRepository";

export default class UserService {
    userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository;
    }

    async Create(body: IUser) {
        const newUser = new UserSchema(body);

        return this.userRepository.Create(newUser);
    }

    async ReadAll() {}

    async ReadOne() {}

    async Update() {}

    async Delete() {}


}