// services/appreciationService.js

import pool from "../db/database.js";

// Ajouter une appréciation
export async function ajouterAppreciation(studentId, teacherId, periode, commentaire) {
    try {
        const resultat = await pool.query(
            `INSERT INTO appreciations (student_id, teacher_id, periode, commentaire)
             VALUES ($1, $2, $3, $4) RETURNING id`,
            [studentId, teacherId, periode, commentaire]
        );
        return resultat.rows[0].id;
    } catch (erreur) {
        console.error("Erreur dans ajouterAppreciation :", erreur);
        throw erreur;
    }
}

// Récupérer les appréciations d'un élève (par période ou global)
export async function listerAppreciationsParEleve(studentId, periode = null) {
    try {
        let query = `
            SELECT 
                appreciations.id,
                appreciations.periode,
                appreciations.commentaire,
                appreciations.created_at,
                users.nom AS prof_nom,
                users.prenom AS prof_prenom
            FROM appreciations
            JOIN users ON appreciations.teacher_id = users.id
            WHERE appreciations.student_id = $1
        `;
        let params = [studentId];

        if (periode) {
            query += ` AND appreciations.periode = $2`;
            params.push(periode);
        }

        query += ` ORDER BY appreciations.created_at DESC`;

        const resultat = await pool.query(query, params);
        return resultat.rows;
    } catch (erreur) {
        console.error("Erreur dans listerAppreciationsParEleve :", erreur);
        return [];
    }
}

// Supprimer une appréciation
export async function supprimerAppreciation(id) {
    try {
        const resultat = await pool.query(
            `DELETE FROM appreciations WHERE id = $1`,
            [id]
        );
        return resultat.rowCount;
    } catch (erreur) {
        console.error("Erreur dans supprimerAppreciation :", erreur);
        return 0;
    }
}