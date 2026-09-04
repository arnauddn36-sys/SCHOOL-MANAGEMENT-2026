// services/bulletinService.js

import pool from "../db/database.js";
import { listerNotesParEleve, calculerMoyennePonderee } from "./gradeService.js";
import { listerAppreciationsParEleve } from "./appreciationService.js";

// ==========================
// Générer le bulletin complet d'un élève pour une période
// ==========================
export async function genererBulletinEleve(idEleve, periode = 'Trimestre 1') {
    try {
        // 1. Récupérer les informations de l'élève
        const eleveRes = await pool.query(
            `SELECT id, nom, prenom FROM students WHERE id = $1`,
            [idEleve]
        );

        if (eleveRes.rows.length === 0) {
            return null; // Élève non trouvé
        }
        const eleve = eleveRes.rows[0];

        // 2. Récupérer les notes de la période
        const notes = await listerNotesParEleve(idEleve, periode);

        // 3. Calculer la moyenne générale pondérée de la période
        const moyenneGenerale = await calculerMoyennePonderee(idEleve, periode);

        // 4. Récupérer les appréciations pour cette période
        const appreciations = await listerAppreciationsParEleve(idEleve, periode);

        // 5. Assembler le tout dans un objet bulletin structuré
        const bulletin = {
            eleve: {
                id: eleve.id,
                nom: eleve.nom,
                prenom: eleve.prenom
            },
            periode: periode,
            notes: notes,
            moyenneGenerale: parseFloat(moyenneGenerale),
            appreciations: appreciations
        };

        return bulletin;
    } catch (erreur) {
        console.error("Erreur dans genererBulletinEleve :", erreur);
        throw erreur;
    }
}