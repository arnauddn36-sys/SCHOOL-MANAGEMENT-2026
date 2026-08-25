// services/statsService.js

import pool from "../db/database.js";

// ==========================
// Meilleur élève
// ==========================
export async function obtenirMeilleurEleve() {
    try {
        const resultat = await pool.query(`
            SELECT 
                students.id,
                students.nom,
                students.prenom,
                AVG(grades.note) AS moyenne
            FROM students
            JOIN grades 
            ON students.id = grades.student_id
            GROUP BY students.id, students.nom, students.prenom
            ORDER BY moyenne DESC
            LIMIT 1
        `);

        if (resultat.rows.length === 0) {
            return null;
        }

        return resultat.rows[0];
    } catch (erreur) {
        console.error("Erreur dans obtenirMeilleurEleve :", erreur);
        return null;
    }
}

// ==========================
// Moyenne générale
// ==========================
export async function obtenirMoyenneGenerale() {
    try {
        const resultat = await pool.query(`
            SELECT AVG(note) AS moyenne_generale
            FROM grades
        `);

        if (resultat.rows.length === 0 || !resultat.rows[0].moyenne_generale) {
            return 0;
        }

        return parseFloat(resultat.rows[0].moyenne_generale);
    } catch (erreur) {
        console.error("Erreur dans obtenirMoyenneGenerale :", erreur);
        return 0;
    }
}

// ==========================
// Nombre utilisateurs
// ==========================
export async function compterUtilisateurs() {
    try {
        const resultat = await pool.query(`
            SELECT COUNT(*) AS total
            FROM users
        `);

        return parseInt(resultat.rows[0].total, 10);
    } catch (erreur) {
        console.error("Erreur dans compterUtilisateurs :", erreur);
        return 0;
    }
}

// ==========================
// Nombre élèves
// ==========================
export async function compterEleves() {
    try {
        const resultat = await pool.query(`
            SELECT COUNT(*) AS total
            FROM students
        `);

        return parseInt(resultat.rows[0].total, 10);
    } catch (erreur) {
        console.error("Erreur dans compterEleves :", erreur);
        return 0;
    }
}

// ==========================
// Nombre professeurs
// ==========================
export async function compterProfesseurs() {
    try {
        const resultat = await pool.query(`
            SELECT COUNT(*) AS total
            FROM teachers
        `);

        return parseInt(resultat.rows[0].total, 10);
    } catch (erreur) {
        console.error("Erreur dans compterProfesseurs :", erreur);
        return 0;
    }
}

// ==========================
// Nombre matières
// ==========================
export async function compterMatieres() {
    try {
        const resultat = await pool.query(`
            SELECT COUNT(*) AS total
            FROM subjects
        `);

        return parseInt(resultat.rows[0].total, 10);
    } catch (erreur) {
        console.error("Erreur dans compterMatieres :", erreur);
        return 0;
    }
}

// ==========================
// Nombre notes
// ==========================
export async function compterNotes() {
    try {
        const resultat = await pool.query(`
            SELECT COUNT(*) AS total
            FROM grades
        `);

        return parseInt(resultat.rows[0].total, 10);
    } catch (erreur) {
        console.error("Erreur dans compterNotes :", erreur);
        return 0;
    }
}

// ==========================
// Nombre absences
// ==========================
export async function compterAbsences() {
    try {
        const resultat = await pool.query(`
            SELECT COUNT(*) AS total_absences
            FROM absences
        `);

        return parseInt(resultat.rows[0].total_absences, 10);
    } catch (erreur) {
        console.error("Erreur dans compterAbsences :", erreur);
        return 0;
    }
}

// ==========================
// Toutes les statistiques
// ==========================
export async function obtenirStatistiques() {
    try {
        // On exécute toutes les promesses en parallèle pour optimiser les performances
        const [
            utilisateurs,
            eleves,
            professeurs,
            matieres,
            notes,
            absences,
            moyenneGenerale,
            meilleurEleve
        ] = await Promise.all([
            compterUtilisateurs(),
            compterEleves(),
            compterProfesseurs(),
            compterMatieres(),
            compterNotes(),
            compterAbsences(),
            obtenirMoyenneGenerale(),
            obtenirMeilleurEleve()
        ]);

        return {
            utilisateurs,
            eleves,
            professeurs,
            matieres,
            notes,
            absences,
            moyenneGenerale,
            meilleurEleve
        };
    } catch (erreur) {
        console.error("Erreur dans obtenirStatistiques :", erreur);
        throw erreur;
    }
}