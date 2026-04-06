import {AsaasService} from "../services/asaasService";

const asaasService = new AsaasService();

export const runDailyBilling = async () => {
  try {
    console.log("Iniciando processamento de cobranças diárias...");
    await asaasService.processarCobrancasDiarias();
  } catch (error) {
    console.error(error);
  }
};
