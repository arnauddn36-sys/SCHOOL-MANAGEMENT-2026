// routes/subjectRoutes.js

import express from "express";

import {

    obtenirMatieres,
    creerMatiere,
    mettreAJourMatiere,
    retirerMatiere

} from "../controllers/subjectController.js";

import { autoriser } from "../utils/permissions.js";

const routeur = express.Router();

// Liste des matières (admin + professeur, utile pour les formulaires de notes)
routeur.get("/", autoriser("admin", "teacher"), obtenirMatieres);

// Ajouter une matière (admin uniquement)
routeur.post("/", autoriser("admin"), creerMatiere);

// Modifier une matière (admin uniquement)
routeur.put("/:id", autoriser("admin"), mettreAJourMatiere);

// Supprimer une matière (admin uniquement)
routeur.delete("/:id", autoriser("admin"), retirerMatiere);

export default routeur;
