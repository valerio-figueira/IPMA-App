import { IHolder } from "../interfaces/IHolder";
import RelativeRepository from "../repositories/RelativeRepository";


export default class RelativeService {
    relativeRepository: RelativeRepository;

    constructor() {
        this.relativeRepository = new RelativeRepository();
    }

    async Create(body: IHolder) {
        return this.relativeRepository.Create(undefined);
    }

    async ReadAll(holder: string) {
        return this.relativeRepository.ReadAll(holder);
    }

    async ReadOne(holder: string, relative: string) {
        return this.relativeRepository.ReadOne(holder, relative);
    }

    async Update() { }

    async Delete() { }


}