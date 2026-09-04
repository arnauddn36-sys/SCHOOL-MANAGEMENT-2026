// services/gradeService.js

import pool from "../db/database.js";

// Ajouter une note (avec période optionnelle)


export async function ajouterNote(idEleve, idMatiere, note, periode = 'Trimestre 1') {
    try {
        const resultat = await pool.query(
            `INSERT INTO grades(student_id, subject_id, note, periode)
             VALUES ($1, $2, $3, $4) RETURNING id`,
            [idEleve, idMatiere, note, periode]
        );

        return resultat.rows[0].id;
    } catch (erreur) {
        console.error("Erreur dans ajouterNote :", erreur);
        throw erreur;
    }
}

// Lister toutes les notes

export async function listerNotes() {
    try {
        const resultat = await pool.query(`
            SELECT
                grades.id,
                students.nom,
                students.prenom,
                subjects.nom AS matiere,
                subjects.coefficient,
                grades.note,
                grades.periode
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

// Récupérer les notes d'un élève précis (par période optionnelle)

export async function listerNotesParEleve(idEleve, periode = null) {
    try {
        let query = `
            SELECT
                grades.id,
                subjects.nom AS matiere,
                subjects.coefficient,
                grades.note,
                grades.periode
            FROM grades
            JOIN subjects ON grades.subject_id = subjects.id
            WHERE grades.student_id = $1
        `;
        let params = [idEleve];

        if (periode) {
            query += ` AND grades.periode = $2`;
            params.push(periode);
        }

        const resultat = await pool.query(query, params);
        return resultat.rows;
    } catch (erreur) {
        console.error("Erreur dans listerNotesParEleve :", erreur);
        return [];
    }
}

// Calculer la moyenne pondérée d'un élève pour une période

export async function calculerMoyennePonderee(idEleve, periode) {
    try {
        const notes = await listerNotesParEleve(idEleve, periode);
        
        let sommeNotesPonderees = 0;
        let sommeCoefficients = 0;

        notes.forEach(n => {
            const valeur = parseFloat(n.note || 0);
            const coefficient = parseFloat(n.coefficient || 1);

            sommeNotesPonderees += valeur * coefficient;
            sommeCoefficients += coefficient;
        });

        if (sommeCoefficients === 0) return 0;

        return (sommeNotesPonderees / sommeCoefficients).toFixed(2);
    } catch (erreur) {
        console.error("Erreur dans calculerMoyennePonderee :", erreur);
        return 0;
    }
}

// Récupérer une note

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

// Modifier une note

export async function modifierNote(id, idEleve, idMatiere, note, periode) {
    try {
        const resultat = await pool.query(
            `UPDATE grades
             SET student_id = $1, subject_id = $2, note = $3, periode = $4
             WHERE id = $5`,
            [idEleve, idMatiere, note, periode, id]
        );

        return resultat.rowCount;
    } catch (erreur) {
        console.error("Erreur dans modifierNote :", erreur);
        return 0;
    }
}

// Supprimer une note
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