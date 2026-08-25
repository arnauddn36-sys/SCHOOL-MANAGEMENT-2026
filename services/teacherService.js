// services/teacherService.js

import pool from "../db/database.js";

// ==========================
// Ajouter un professeur
// ==========================
export async function ajouterProfesseur(nom, prenom) {
    try {
        const resultat = await pool.query(
            `INSERT INTO teachers(nom, prenom) VALUES ($1, $2) RETURNING id`,
            [nom, prenom]
        );

        return resultat.rows[0].id;
    } catch (erreur) {
        console.error("Erreur dans ajouterProfesseur :", erreur);
        throw erreur;
    }
}

// ==========================
// Récupérer un professeur par ID
// ==========================
export async function obtenirProfesseurParId(id) {
    try {
        const resultat = await pool.query(
            `SELECT * FROM teachers WHERE id = $1`,
            [id]
        );

        if (resultat.rows.length === 0) {
            return null;
        }

        return resultat.rows[0];
    } catch (erreur) {
        console.error("Erreur dans obtenirProfesseurParId :", erreur);
        return null;
    }
}

// ==========================
// Lister les professeurs avec leurs matières
// ==========================
export async function listerProfesseurs() {
    try {
        const resultat = await pool.query(`
            SELECT
                teachers.id,
                teachers.nom,
                teachers.prenom,
                STRING_AGG(subjects.nom, ',') AS matieres
            FROM teachers
            LEFT JOIN teacher_subjects ON teachers.id = teacher_subjects.teacher_id
            LEFT JOIN subjects ON teacher_subjects.subject_id = subjects.id
            GROUP BY teachers.id, teachers.nom, teachers.prenom
        `);

        return resultat.rows.map(professeur => ({
            ...professeur,
            matieres: professeur.matieres
                ? professeur.matieres.split(",")
                : []
        }));
    } catch (erreur) {
        console.error("Erreur dans listerProfesseurs :", erreur);
        return [];
    }
}

// ==========================
// Récupérer le professeur lié à un compte utilisateur (espace "Mon profil")
// ==========================
export async function obtenirProfesseurParUtilisateur(idUtilisateur) {
    try {
        const resultat = await pool.query(
            `SELECT * FROM teachers WHERE user_id = $1`,
            [idUtilisateur]
        );

        if (resultat.rows.length === 0) {
            return null;
        }

        return resultat.rows[0];
    } catch (erreur) {
        console.error("Erreur dans obtenirProfesseurParUtilisateur :", erreur);
        return null;
    }
}

// ==========================
// Modifier un professeur
// ==========================
export async function modifierProfesseur(id, nom, prenom) {
    try {
        const resultat = await pool.query(
            `UPDATE teachers
             SET nom = $1, prenom = $2
             WHERE id = $3`,
            [nom, prenom, id]
        );

        return resultat.rowCount;
    } catch (erreur) {
        console.error("Erreur dans modifierProfesseur :", erreur);
        return 0;
    }
}

// ==========================
// Supprimer un professeur
// ==========================
export async function supprimerProfesseur(id) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Supprime les associations professeur-matière
        await client.query(
            `DELETE FROM teacher_subjects WHERE teacher_id = $1`,
            [id]
        );

        // Supprime le professeur
        const resultat = await client.query(
            `DELETE FROM teachers WHERE id = $1`,
            [id]
        );

        await client.query("COMMIT");
        return resultat.rowCount;
    } catch (erreur) {
        await client.query("ROLLBACK");
        console.error("Erreur dans supprimerProfesseur :", erreur);
        return 0;
    } finally {
        client.release();
    }
}

// ==========================
// Assigner une matière
// ==========================
export async function attribuerMatiere(idProfesseur, idMatiere) {
    try {
        const resultat = await pool.query(
            `INSERT INTO teacher_subjects(teacher_id, subject_id)
             VALUES ($1, $2)`,
            [idProfesseur, idMatiere]
        );

        return resultat.rowCount;
    } catch (erreur) {
        console.error("Erreur dans attribuerMatiere :", erreur);
        throw erreur;
    }
}

// ==========================
// Liste des matières (disponible aussi via subjectService.js)
// ==========================
export async function listerMatieresDisponibles() {
    try {
        const resultat = await pool.query(`SELECT * FROM subjects`);
        return resultat.rows;
    } catch (erreur) {
        console.error("Erreur dans listerMatieresDisponibles :", erreur);
        return [];
    }
}