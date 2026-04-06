// routes/index.ts
import * as express from "express";
import * as asaasController from "../controllers/asaasController";

const router = express.Router();

router.post("/pagamento", asaasController.runDailyBilling);

export default router;
