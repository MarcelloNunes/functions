// repositories/clientRepository.ts
import * as admin from "firebase-admin";

export class PsicologoRepository {
  async updateAsaasId(clientId: string, asaasCustomerId: string) {
    return admin.firestore()
      .collection("psiycologists")
      .doc(clientId)
      .update({asaasCustomerId});
  }
}
