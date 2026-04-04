import {Request, Response} from "express";
import {AsaasService} from "../services/asaasService";

const asaasService = new AsaasService();

export const runDailyBilling = async () => {
  try {
    await asaasService.processarCobrancasDiarias();
  } catch (error) {
    console.error(error);
  }
};