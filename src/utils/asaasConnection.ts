import axios, { AxiosInstance } from 'axios';
import { Config } from '../utils/config'; 

export function getAsaasConnection(apiKey: string): AxiosInstance {
    return axios.create({
        baseURL: Config.ASAAS_BASE_URL,
        headers: {
            'access_token': apiKey,
        },
    });
}