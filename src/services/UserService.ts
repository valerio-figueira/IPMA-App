import { IHolder } from "../interfaces/IHolder";
import HolderSchema from "../model/HolderSchema";
import UserRepository from "../repositories/UserRepository";

export default class UserService {
    userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async Create(body: IHolder) {
        const newUser = new HolderSchema(body);

        return this.userRepository.Create(newUser);
    }

    async ReadAll(query: any) {
        return this.userRepository.ReadAll(query)
    }

    async ReadOne(holder_id: string) {
        return this.userRepository.ReadOne(holder_id);
    }

    async Update(holder_id: string, query: IHolder) {
        return this.userRepository.Update(holder_id, query);
    }

    async Delete(holder_id: string) {
        return this.userRepository.Delete(holder_id);
    }


}