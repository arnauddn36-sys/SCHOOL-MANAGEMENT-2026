// routes/statsRoutes.js

import express from "express";

import { recupererStatistiques } from "../controllers/statsController.js";
import { autoriser } from "../utils/permissions.js";

const routeur = express.Router();

// Les statistiques globales sont réservées à l'administrateur.
routeur.get("/", autoriser("admin"), recupererStatistiques);

export default routeur;
