import axios from "axios";
import {db} from "../index";
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

  
  async processarCobrancasDiarias() {
    const today = new Date();
    const todayDay = today.getDate();

    const snapshot = await db.collection("psychologists")
      .where("ativarCobranca", "==", true)
      .get();

    for (const doc of snapshot.docs) {
      const data = doc.data();

      if (!data.billingDate) continue;

      const billingDay = new Date(data.billingDate).getDate();

      // só cobra no dia certo
      if (billingDay !== todayDay) continue;

      try {
        const hojeISO = today.toISOString().split("T")[0];

        // evita duplicação no mesmo dia
        if (data.lastBillingDate === hojeISO) continue;

        await this.criarCobranca({
          asaasCustomerId: data.asaasCustomerId,
          valor: data.valorCobranca,
          dataVencimento: hojeISO,
          descricao: "Cobrança mensal",
        });

        // salva controle
        await doc.ref.update({
          lastBillingDate: hojeISO,
        });

        console.log(`Cobrança criada: ${doc.id}`);

      } catch (error) {
        console.error(`Erro ao cobrar ${doc.id}`, error);
      }
    }
  }
}
