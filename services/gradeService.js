// services/gradeService.js

import pool from "../db/database.js";

// ==========================
// Ajouter une note
// ==========================
export async function ajouterNote(idEleve, idMatiere, note) {
    try {
        const resultat = await pool.query(
            `INSERT INTO grades(student_id, subject_id, note)
             VALUES ($1, $2, $3) RETURNING id`,
            [idEleve, idMatiere, note]
        );

        return resultat.rows[0].id;
    } catch (erreur) {
        console.error("Erreur dans ajouterNote :", erreur);
        throw erreur;
    }
}

// ==========================
// Lister toutes les notes
// ==========================
export async function listerNotes() {
    try {
        const resultat = await pool.query(`
            SELECT
                grades.id,
                students.nom,
                students.prenom,
                subjects.nom AS matiere,
                grades.note
            FROM grades
            JOIN students ON grades.student_id = students.id
            JOIN subjects ON grades.subject_id = subjects.id
        `);

        return resultat.rows;
    } catch (erreur) {
        console.error("Erreur dans listerNotes :", erreur);
        return [];
    }
}

// ==========================
// Récupérer les notes d'un élève précis
// ==========================
export async function listerNotesParEleve(idEleve) {
    try {
        const resultat = await pool.query(`
            SELECT
                grades.id,
                subjects.nom AS matiere,
                grades.note
            FROM grades
            JOIN subjects ON grades.subject_id = subjects.id
            WHERE grades.student_id = $1
        `, [idEleve]);

        return resultat.rows;
    } catch (erreur) {
        console.error("Erreur dans listerNotesParEleve :", erreur);
        return [];
    }
}

// ==========================
// Récupérer une note
// ==========================
export async function obtenirNoteParId(id) {
    try {
        const resultat = await pool.query(
            `SELECT * FROM grades WHERE id = $1`,
            [id]
        );

        if (resultat.rows.length === 0) {
            return null;
        }

        return resultat.rows[0];
    } catch (erreur) {
        console.error("Erreur dans obtenirNoteParId :", erreur);
        return null;
    }
}

// ==========================
// Modifier une note
// ==========================
export async function modifierNote(id, idEleve, idMatiere, note) {
    try {
        const resultat = await pool.query(
            `UPDATE grades
             SET student_id = $1, subject_id = $2, note = $3
             WHERE id = $4`,
            [idEleve, idMatiere, note, id]
        );

        return resultat.rowCount;
    } catch (erreur) {
        console.error("Erreur dans modifierNote :", erreur);
        return 0;
    }
}

// ==========================
// Supprimer une note
// ==========================
export async function supprimerNote(id) {
    try {
        const resultat = await pool.query(
            `DELETE FROM grades WHERE id = $1`,
            [id]
        );

        return resultat.rowCount;
    } catch (erreur) {
        console.error("Erreur dans supprimerNote :", erreur);
        return 0;
    }
}