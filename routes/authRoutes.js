// routes/authRoutes.js

import express from "express";
import { connexion, inscription } from "../controllers/authController.js";

const routeur = express.Router();

// ROUTE DE CONNEXION

// POST /api/auth/login
routeur.post("/login", connexion);

// ROUTE D'INSCRIPTION (élève uniquement, rôle forcé côté serveur)

// POST /api/auth/register
routeur.post("/register", inscription);

// Export du routeur
export default routeur;