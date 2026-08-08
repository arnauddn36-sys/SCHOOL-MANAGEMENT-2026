import bd from "../db/database.js";

// ==========================
// Meilleur élève
// ==========================

export function obtenirMeilleurEleve() {

    const resultat = bd.prepare(`
        SELECT 
            students.id,
            students.nom,
            students.prenom,
            AVG(grades.note) AS moyenne
        FROM students
        JOIN grades 
        ON students.id = grades.student_id
        GROUP BY students.id
        ORDER BY moyenne DESC
        LIMIT 1
    `).get();

    return resultat;

}

// ==========================
// Moyenne générale
// ==========================

export function obtenirMoyenneGenerale() {

    const resultat = bd.prepare(`
        SELECT AVG(note) AS moyenne_generale
        FROM grades
    `).get();

    return resultat.moyenne_generale;

}

// ==========================
// Nombre utilisateurs
// ==========================

export function compterUtilisateurs() {

    const resultat = bd.prepare(`
        SELECT COUNT(*) AS total
        FROM users
    `).get();

    return resultat.total;

}

// ==========================
// Nombre élèves
// ==========================

export function compterEleves() {

    const resultat = bd.prepare(`
        SELECT COUNT(*) AS total
        FROM students
    `).get();

    return resultat.total;

}

// ==========================
// Nombre professeurs
// ==========================

export function compterProfesseurs() {

    const resultat = bd.prepare(`
        SELECT COUNT(*) AS total
        FROM teachers
    `).get();

    return resultat.total;

}

// ==========================
// Nombre matières
// ==========================

export function compterMatieres() {

    const resultat = bd.prepare(`
        SELECT COUNT(*) AS total
        FROM subjects
    `).get();

    return resultat.total;

}

// ==========================
// Nombre notes
// ==========================

export function compterNotes() {

    const resultat = bd.prepare(`
        SELECT COUNT(*) AS total
        FROM grades
    `).get();

    return resultat.total;

}

// ==========================
// Nombre absences
// ==========================

export function compterAbsences() {

    const resultat = bd.prepare(`
        SELECT COUNT(*) AS total_absences
        FROM absences
    `).get();

    return resultat.total_absences;

}

// ==========================
// Toutes les statistiques
// ==========================

export function obtenirStatistiques() {

    return {

        utilisateurs: compterUtilisateurs(),

        eleves: compterEleves(),

        professeurs: compterProfesseurs(),

        matieres: compterMatieres(),

        notes: compterNotes(),

        absences: compterAbsences(),

        moyenneGenerale: obtenirMoyenneGenerale(),

        meilleurEleve: obtenirMeilleurEleve()

    };

}
