// routes/bulletinRoutes.js

import express from "express";
import { recupererBulletin } from "../controllers/bulletinController.js";

const router = express.Router();

// Route pour récupérer le bulletin d'un élève
// Ex: GET /api/bulletins/1?periode=Trimestre%201
// ==========================
router.get("/:idEleve", recupererBulletin);

export default router;