// routes/index.ts
import * as express from "express";
import { criarPagamento } from "../controllers/pagamentoController";

const router = express.Router();

router.post("/pagamento", criarPagamento);

export default router;