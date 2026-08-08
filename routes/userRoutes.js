// routes/userRoutes.js

import express from "express";

import {
    obtenirUtilisateurs,
    obtenirUtilisateurUnique,
    creerUtilisateur,
    mettreAJourUtilisateur,
    retirerUtilisateur
} from "../controllers/userController.js";

import { autoriser } from "../utils/permissions.js";

const routeur = express.Router();

// La gestion des comptes utilisateurs est réservée à l'administrateur.
routeur.get("/", autoriser("admin"), obtenirUtilisateurs);
routeur.get("/:id", autoriser("admin"), obtenirUtilisateurUnique);
routeur.post("/", autoriser("admin"), creerUtilisateur);
routeur.put("/:id", autoriser("admin"), mettreAJourUtilisateur);
routeur.delete("/:id", autoriser("admin"), retirerUtilisateur);

export default routeur;
