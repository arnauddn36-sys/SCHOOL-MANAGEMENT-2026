// routes/teacherRoutes.js

import express from "express";

import {

    obtenirProfesseurs,
    creerProfesseur,
    mettreAJourProfesseur,
    retirerProfesseur,
    attribuerMatiereProfesseur,
    obtenirMatieres,
    obtenirMonProfilProfesseur

} from "../controllers/teacherController.js";

import { autoriser } from "../utils/permissions.js";

const routeur = express.Router();

// Profil du professeur connecté (placé avant "/:id" pour ne pas être capturé par elle)
routeur.get("/me", autoriser("teacher"), obtenirMonProfilProfesseur);

// Liste des professeurs (admin + professeur)
routeur.get("/", autoriser("admin", "teacher"), obtenirProfesseurs);

// Récupérer les matières (placé avant "/:id" pour ne pas être capturé par elle)
routeur.get("/subjects/list", autoriser("admin", "teacher"), obtenirMatieres);

// Attribuer une matière à un professeur (placé avant "/:id" pour ne pas être capturé par elle)
routeur.put("/assign-subject", autoriser("admin"), attribuerMatiereProfesseur);

// Ajouter un professeur (admin uniquement)
routeur.post("/", autoriser("admin"), creerProfesseur);

// Modifier un professeur (admin uniquement) -- doit rester après les routes fixes ci-dessus
routeur.put("/:id", autoriser("admin"), mettreAJourProfesseur);

// Supprimer un professeur (admin uniquement)
routeur.delete("/:id", autoriser("admin"), retirerProfesseur);

export default routeur;
