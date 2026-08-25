// services/teacherSubjectService.js (ou le fichier correspondant)

import pool from "../db/database.js";

// ==========================
// Ajouter une matière à un professeur
// ==========================
export async function attribuerMatiere(idProfesseur, idMatiere) {
    try {
        const resultat = await pool.query(
            `INSERT INTO teacher_subjects(teacher_id, subject_id)
             VALUES($1, $2) RETURNING id`,
            [idProfesseur, idMatiere]
        );

        return resultat.rows[0].id;
    } catch (erreur) {
        console.error("Erreur dans attribuerMatiere :", erreur);
        throw erreur;
    }
}

// ==========================
// Voir les matières d'un professeur
// ==========================
export async function obtenirMatieresProfesseur(idProfesseur) {
    try {
        const resultat = await pool.query(
            `SELECT
                subjects.id,
                subjects.nom
             FROM subjects
             JOIN teacher_subjects ON subjects.id = teacher_subjects.subject_id
             WHERE teacher_subjects.teacher_id = $1`,
            [idProfesseur]
        );

        return resultat.rows;
    } catch (erreur) {
        console.error("Erreur dans obtenirMatieresProfesseur :", erreur);
        return [];
    }
}

// ==========================
// Retirer une matière
// ==========================
export async function retirerMatiere(idProfesseur, idMatiere) {
    try {
        const resultat = await pool.query(
            `DELETE FROM teacher_subjects
             WHERE teacher_id = $1 AND subject_id = $2`,
            [idProfesseur, idMatiere]
        );

        return resultat.rowCount;
    } catch (erreur) {
        console.error("Erreur dans retirerMatiere :", erreur);
        return 0;
    }
}