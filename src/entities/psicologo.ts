export class Psicologo {
    id: string;
    asaasCustomerId?: string;
    nome: string;
    email: string;
    cpfCnpj: string;
    telefone: string;
    crp: string;
    especialidade: string;
    ativo: boolean;
    dataCriacao: Date;
    constructor(
        id: string,
        asaasCustomerId: string | undefined,
        nome: string,
        email: string,
        cpfCnpj: string,
        telefone: string,
        crp: string,
        especialidade: string,
        ativo: boolean,
        dataCriacao: Date,
    ) {
        this.id = id;
        this.asaasCustomerId = asaasCustomerId;
        this.nome = nome;
        this.email = email;
        this.cpfCnpj = cpfCnpj;
        this.telefone = telefone;
        this.crp = crp;
        this.especialidade = especialidade;
        this.ativo = ativo;
        this.dataCriacao = dataCriacao;
    }
}