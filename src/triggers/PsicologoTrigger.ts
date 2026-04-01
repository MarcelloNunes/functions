import {AsaasService} from "../services/asaasService";
import {PsicologoRepository} from "../repositories/psicologoRepository";
import {Psicologo} from "../entities/psicologo";
import {onDocumentCreated} from "firebase-functions/v2/firestore";

const asaasService = new AsaasService();
const psicologoRepository = new PsicologoRepository();

export const onClientCreate = onDocumentCreated(
  "psychologists/{clientId}",
  async (event) => {
    const data = event.data?.data() as Psicologo;
    const clientId = event.params.clientId;

    console.log("🔥 Trigger disparado", clientId);

    try {
      if (!data || data.asaasCustomerId) return;

      console.log("📥 Dados recebidos:", data);

      // 1. validação básica
      if (!data.cpfCnpj || !data.nome || !data.email) {
        console.error("❌ Dados obrigatórios faltando", data);
        return;
      }

      // 2. verifica no Asaas
      const existing = await asaasService.findCustomerByCpf(data.cpfCnpj);

      if (existing) {
        console.log("⚠️ Cliente já existe no Asaas", existing.id);

        await psicologoRepository.updateAsaasId(clientId, existing.id);
        return;
      }



      console.log("📤 Enviando para Asaas:", data);

      const created = await asaasService.createCustomer(data);

      console.log("✅ Criado no Asaas:", created);

      await psicologoRepository.updateAsaasId(clientId, created.id);

      console.log("💾 ID salvo no Firestore");

    } catch (error: any) {
      console.error("🔥 ERRO NO ASAAS:", {
        message: error.message,
        response: error.response?.data
      });
    }
  }
);
