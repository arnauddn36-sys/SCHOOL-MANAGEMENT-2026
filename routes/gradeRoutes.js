// routes/gradeRoutes.js

import express from "express";

import {

    obtenirNotes,
    obtenirNotesEleve,
    creerNote,
    mettreAJourNote,
    retirerNote

} from "../controllers/gradeController.js";

import { autoriser } from "../utils/permissions.js";

const routeur = express.Router();

// Liste de toutes les notes (admin + professeur)
routeur.get("/", autoriser("admin", "teacher"), obtenirNotes);

// Notes d'un élève précis (admin + professeur + élève concerné)
routeur.get("/student/:id", autoriser("admin", "teacher", "student"), obtenirNotesEleve);

// Ajouter une note (admin + professeur)
routeur.post("/", autoriser("admin", "teacher"), creerNote);

// Modifier une note (admin + professeur)
routeur.put("/:id", autoriser("admin", "teacher"), mettreAJourNote);

// Supprimer une note (admin + professeur)
routeur.delete("/:id", autoriser("admin", "teacher"), retirerNote);

export default routeur;
