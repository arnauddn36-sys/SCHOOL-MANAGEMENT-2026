// services/subjectService.js

import pool from "../db/database.js";

// ==========================
// Ajouter une matière
// ==========================
export async function ajouterMatiere(nom, coefficient = 1) {
    try {
        const resultat = await pool.query(
            `INSERT INTO subjects (nom, coefficient) VALUES ($1, $2) RETURNING id`,
            [nom, Number(coefficient) || 1]
        );

        return resultat.rows[0].id;
    } catch (erreur) {
        console.error("Erreur dans ajouterMatiere :", erreur);
        throw erreur;
    }
}

// ==========================
// Lister les matières
// ==========================
export async function listerMatieres() {
    try {
        const resultat = await pool.query(`SELECT * FROM subjects ORDER BY id ASC`);
        return resultat.rows;
    } catch (erreur) {
        console.error("Erreur dans listerMatieres :", erreur);
        return [];
    }
}

// ==========================
// Récupérer une matière par ID
// ==========================
export async function obtenirMatiereParId(id) {
    try {
        const resultat = await pool.query(
            `SELECT * FROM subjects WHERE id = $1`,
            [id]
        );

        if (resultat.rows.length === 0) {
            return null;
        }

        return resultat.rows[0];
    } catch (erreur) {
        console.error("Erreur dans obtenirMatiereParId :", erreur);
        return null;
    }
}

// ==========================
// Modifier une matière
// ==========================
export async function modifierMatiere(id, nom, coefficient) {
    try {
        const resultat = await pool.query(
            `UPDATE subjects SET nom = $1, coefficient = $2 WHERE id = $3`,
            [nom, Number(coefficient) || 1, id]
        );

        return resultat.rowCount;
    } catch (erreur) {
        console.error("Erreur dans modifierMatiere :", erreur);
        return 0;
    }
}

// ==========================
// Supprimer une matière
// ==========================
export async function supprimerMatiere(id) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Supprimer les associations professeur-matière
        await client.query(
            `DELETE FROM teacher_subjects WHERE subject_id = $1`,
            [id]
        );

        // Supprimer la matière
        const resultat = await client.query(
            `DELETE FROM subjects WHERE id = $1`,
            [id]
        );

        await client.query("COMMIT");
        return resultat.rowCount;
    } catch (erreur) {
        await client.query("ROLLBACK");
        console.error("Erreur dans supprimerMatiere :", erreur);
        return 0;
    } finally {
        client.release();
    }
}