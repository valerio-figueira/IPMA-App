import { IUser } from "../interfaces/IUser";
import UserSchema from "../model/UserSchema";
import UserRepository from "../repositories/UserRepository";

export default class UserService {
    userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async Create(body: IUser) {
        const newUser = new UserSchema(body);

        return this.userRepository.Create(newUser);
    }

    async ReadAll(query: any) {
        return this.userRepository.ReadAll(query)
    }

    async ReadOne(holder_id: string) {
        return this.userRepository.ReadOne(holder_id);
    }

    async Update() {}

    async Delete() {}


}