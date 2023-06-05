import InstallmentRepository from "../repositories/InstallmentRepository";

export default class InstallmentService {
    installmentRepository: InstallmentRepository;

    constructor() {
        this.installmentRepository = new InstallmentRepository();
    }

    async Create() { }

    async ReadAll(holder: string | undefined = undefined) {
        return this.installmentRepository.ReadAll(holder);
    }

    async ReadOne(installment_id: string) {
        return this.installmentRepository.ReadOne(installment_id);
    }

    async Update() { }

    async Delete() { }

}