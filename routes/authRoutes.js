// routes/authRoutes.js

import express from "express";
import { connexion } from "../controllers/authController.js";

const routeur = express.Router();

// ROUTE DE CONNEXION

// POST /api/auth/login
routeur.post("/login", connexion);

// Export du routeur
export default routeur;
