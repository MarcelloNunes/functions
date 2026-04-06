export class Psicologo {
  id: string;
  asaasCustomerId?: string;
  name: string;
  email: string;
  cpfCnpj: string;
  whatsapp: string;
  crp: string;
  especialidade: string;
  ativo: boolean;
  dataCriacao: Date;
  constructor(
    id: string,
    asaasCustomerId: string | undefined,
    name: string,
    email: string,
    cpfCnpj: string,
    whatsapp: string,
    crp: string,
    especialidade: string,
    ativo: boolean,
    dataCriacao: Date,
  ) {
    this.id = id;
    this.asaasCustomerId = asaasCustomerId;
    this.name = name;
    this.email = email;
    this.cpfCnpj = cpfCnpj;
    this.whatsapp = whatsapp;
    this.crp = crp;
    this.especialidade = especialidade;
    this.ativo = ativo;
    this.dataCriacao = dataCriacao;
  }
}
