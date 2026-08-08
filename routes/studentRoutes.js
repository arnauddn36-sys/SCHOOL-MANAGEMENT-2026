// routes/studentRoutes.js

import express from "express";

import {
    obtenirEleves,
    obtenirEleveUnique,
    obtenirMonProfilEleve,
    creerEleve,
    mettreAJourEleve,
    retirerEleve
} from "../controllers/studentController.js";

import { autoriser } from "../utils/permissions.js";

const routeur = express.Router();

// ==========================
// Profil de l'élève connecté (avant la route "/:id" pour ne pas être capturée par elle)
// ==========================
routeur.get("/me", autoriser("student"), obtenirMonProfilEleve);

// ==========================
// Liste des élèves (admin + professeur)
// ==========================
routeur.get("/", autoriser("admin", "teacher"), obtenirEleves);

// ==========================
// Un élève par ID (admin + professeur)
// ==========================
routeur.get("/:id", autoriser("admin", "teacher"), obtenirEleveUnique);

// ==========================
// Ajouter un élève (admin uniquement)
// ==========================
routeur.post("/", autoriser("admin"), creerEleve);

// ==========================
// Modifier un élève (admin uniquement)
// ==========================
routeur.put("/:id", autoriser("admin"), mettreAJourEleve);

// ==========================
// Supprimer un élève (admin uniquement)
// ==========================
routeur.delete("/:id", autoriser("admin"), retirerEleve);

export default routeur;
