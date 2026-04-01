import * as dotenv from "dotenv";
dotenv.config();

export class Config {
  static readonly ASAAS_API_KEY = process.env.ASAAS_API_KEY as string;
  static readonly ASAAS_BASE_URL = process.env.ASAAS_BASE_URL as string;
}
