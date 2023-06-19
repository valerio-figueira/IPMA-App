import { IHolder } from "../interfaces/IHolder";
import HolderSchema from "../model/HolderSchema";
import UserRepository from "../repositories/UserRepository";
import CustomError from "../classes/CustomError";

export default class UserService {
    userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async Create(body: IHolder) {
        console.log(body)
        const newUser = new HolderSchema(body);

        return this.userRepository.Create(newUser);
    }

    async ReadAll(query: any) {
        return this.userRepository.ReadAll(query)
    }

    async ReadOne(holder_id: string) {
        const user = await this.userRepository.ReadOne(holder_id);

        if(typeof user === 'object') {
            if(user.length === 0) throw new CustomError('Usuário não encontrado', 400);
            return user;
        }
    }

    async Update(holder_id: string, query: IHolder) {
        return this.userRepository.Update(holder_id, query);
    }

    async Delete(holder_id: string) {
        return this.userRepository.Delete(holder_id);
    }


}