import {Request, Response} from "express";
import {AsaasService} from "../services/asaasService";

const asaasService = new AsaasService();

export const criarCobrancaController = async (req: Request, res: Response) => {
  const result = await asaasService.criarCobranca(req.body);
  res.json(result);
};
export const cobrancaRotinaController = async (req: Request, res: Response) => {
  const result = await asaasService.criarCobranca(req.body);
  res.json(result);
};
