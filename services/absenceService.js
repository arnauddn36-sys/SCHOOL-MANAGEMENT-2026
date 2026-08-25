// services/absenceService.js
// Logique d'accès à la base de données pour les absences avec PostgreSQL.

import pool from "../db/database.js"; // Connexion au pool PostgreSQL

// ==========================
// Ajouter une absence
// ==========================
export async function ajouterAbsence(idEleve, date, statut) {
    try {
        const resultat = await pool.query(
            `INSERT INTO absences (student_id, date, status)
             VALUES ($1, $2, $3) RETURNING id`,
            [idEleve, date, statut]
        );

        return resultat.rows[0].id; // ID de l'absence créée
    } catch (erreur) {
        console.error("Erreur dans ajouterAbsence :", erreur);
        throw erreur;
    }
}

// ==========================
// Lister toutes les absences (avec le nom de l'élève concerné)
// ==========================
export async function listerAbsences() {
    try {
        const resultat = await pool.query(`
            SELECT
                absences.id,
                absences.date,
                absences.status,
                students.nom,
                students.prenom
            FROM absences
            JOIN students ON absences.student_id = students.id
            ORDER BY absences.date DESC
        `);

        return resultat.rows;
    } catch (erreur) {
        console.error("Erreur dans listerAbsences :", erreur);
        return [];
    }
}

// ==========================
// Lister les absences d'un élève précis (espace élève / professeur)
// ==========================
export async function listerAbsencesParEleve(idEleve) {
    try {
        const resultat = await pool.query(`
            SELECT id, date, status
            FROM absences
            WHERE student_id = $1
            ORDER BY date DESC
        `, [idEleve]);

        return resultat.rows;
    } catch (erreur) {
        console.error("Erreur dans listerAbsencesParEleve :", erreur);
        return [];
    }
}

// ==========================
// Récupérer une absence par son id
// ==========================
export async function obtenirAbsenceParId(id) {
    try {
        const resultat = await pool.query(
            `SELECT * FROM absences WHERE id = $1`,
            [id]
        );

        if (resultat.rows.length === 0) {
            return null;
        }

        return resultat.rows[0];
    } catch (erreur) {
        console.error("Erreur dans obtenirAbsenceParId :", erreur);
        return null;
    }
}

// ==========================
// Modifier une absence
// ==========================
export async function modifierAbsence(id, idEleve, date, statut) {
    try {
        const resultat = await pool.query(
            `UPDATE absences
             SET student_id = $1, date = $2, status = $3
             WHERE id = $4`,
            [idEleve, date, statut, id]
        );

        return resultat.rowCount; // Nombre de lignes modifiées
    } catch (erreur) {
        console.error("Erreur dans modifierAbsence :", erreur);
        return 0;
    }
}

// ==========================
// Supprimer une absence
// ==========================
export async function supprimerAbsence(id) {
    try {
        const resultat = await pool.query(
            `DELETE FROM absences WHERE id = $1`,
            [id]
        );

        return resultat.rowCount; // Nombre de lignes supprimées
    } catch (erreur) {
        console.error("Erreur dans supprimerAbsence :", erreur);
        return 0;
    }
}