import axios from "axios";
import {Config} from "../utils/config";

export class AsaasService {
  async findCustomerByCpf(cpfCnpj: string) {
    const response = await axios.get(`${Config.ASAAS_BASE_URL}/customers`, {
      params: {cpfCnpj},
      headers: {
        access_token: Config.ASAAS_API_KEY,
      },
    });

    return response.data.data[0] || null;
  }

  async createCustomer(data: any) {
    const payload = {
      name: data.nome,
      email: data.email,
      phone: data.telefone,
    };
    const response = await axios.post(
      `${Config.ASAAS_BASE_URL}/customers`,
      payload,
      {
        headers: {
          access_token: Config.ASAAS_API_KEY,
        },
      }
    );

    return response.data;
  }

  async criarCobranca(data: any) {
    const response = await axios.post(
      `${Config.ASAAS_BASE_URL}/payments`,
      {
        customer: data.asaasCustomerId,
        billingType: "PIX", // ou BOLETO
        value: data.valor,
        dueDate: data.dataVencimento,
        description: data.descricao,
      },
      {
        headers: {
          access_token: Config.ASAAS_API_KEY,
        },
      }
    );

    return response.data;
  }
}
