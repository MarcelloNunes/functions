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

    // 1. evita duplicação
    if (!data || data.asaasCustomerId) return;

    // 2. verifica no Asaas
    const existing = await asaasService.findCustomerByCpf(data.cpfCnpj);

    if (existing) {
      await psicologoRepository.updateAsaasId(clientId, existing.id);
      return;
    }

    // 3. cria cliente
    const created = await asaasService.createCustomer(data);

    await psicologoRepository.updateAsaasId(clientId, created.id);
  }
);
