// routes/absenceRoutes.js

import express from "express";

import {
    obtenirAbsences,
    obtenirAbsencesEleve,
    creerAbsence,
    mettreAJourAbsence,
    retirerAbsence
} from "../controllers/absenceController.js";

import { autoriser } from "../utils/permissions.js";

const routeur = express.Router();

// ==========================
// Liste de toutes les absences (admin + professeur)
// ==========================
routeur.get("/", autoriser("admin", "teacher"), obtenirAbsences);

// ==========================
// Absences d'un élève précis (admin + professeur + élève concerné)
// ==========================
routeur.get("/student/:id", autoriser("admin", "teacher", "student"), obtenirAbsencesEleve);

// ==========================
// Ajouter une absence (admin + professeur)
// ==========================
routeur.post("/", autoriser("admin", "teacher"), creerAbsence);

// ==========================
// Modifier une absence (admin + professeur)
// ==========================
routeur.put("/:id", autoriser("admin", "teacher"), mettreAJourAbsence);

// ==========================
// Supprimer une absence (admin + professeur)
// ==========================
routeur.delete("/:id", autoriser("admin", "teacher"), retirerAbsence);

export default routeur;
