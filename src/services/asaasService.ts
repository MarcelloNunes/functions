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
      cpfCnpj: data.cpfCnpj,
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
    try {
      console.log("Payload enviado:", {
        customer: data.asaasCustomerId,
        billingType: "PIX",
        value: data.valor,
        dueDate: data.dataVencimento,
        description: data.descricao,
      });
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
    } catch (error: any) {
      console.log("STATUS:", error.response?.status);

      // 🔥 ISSO AQUI É O QUE IMPORTA
      console.log("ERRORS:", JSON.stringify(error.response?.data?.errors, null, 2));

      throw error; // opcional, mas bom manter
    }
  }


  async processarCobrancasDiarias() {
    const today = new Date( new Date()
      .toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));
    const todayDay = today.getDate();

    const yearMonth = `${today.getFullYear()}-${today.getMonth() + 1}`;

    const snapshot = await db.collection("psychologists")
      .where("ativarCobranca", "==", true)
      .get();

    console.log("Total encontrados:", snapshot.size); // 👈

    for (const doc of snapshot.docs) {
      console.log("Processando doc:", doc.id); // 👈

      const data = doc.data();

      console.log("Dados:", JSON.stringify(data)); // 👈

      if (!data.billingDate) {
        console.log("Sem billingDate");
        continue;
      }

      const billingDay = new Date(data.billingDate).getDate();

      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      ).getDate();

      const effectiveBillingDay = Math.min(billingDay, lastDayOfMonth);

      console.log({
        todayDay,
        billingDay,
        effectiveBillingDay,
      }); // 👈

      if (todayDay !== effectiveBillingDay) {
        console.log("Dia não bate");
        continue;
      }

      if (data.lastBillingMonth === yearMonth) {
        console.log("Já cobrado esse mês");
        continue;
      }

      try {
        const hojeISO = today.toISOString().split("T")[0];

        console.log("VAI COBRAR"); // 👈

        await this.criarCobranca({
          asaasCustomerId: data.asaasCustomerId,
          valor: 30.00,
          dataVencimento: hojeISO,
          descricao: "Cobrança mensal",
        });

        await doc.ref.update({
          lastBillingMonth: yearMonth,
        });

        console.log(`Cobrança criada: ${doc.id}`);
      } catch (error) {
        console.error(`Erro ao cobrar ${doc.id}`, error);
      }
    }
  }
}
