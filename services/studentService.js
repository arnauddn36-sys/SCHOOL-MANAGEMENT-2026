// services/studentService.js
// Logique d'accès à la base de données pour les élèves avec PostgreSQL.

import pool from "../db/database.js";

// ==========================
// Ajouter un élève
// ==========================
export async function ajouterEleve(matricule, nom, prenom, age, classe, idUtilisateur = null) {
    try {
        const resultat = await pool.query(
            `INSERT INTO students(matricule, nom, prenom, age, classe, user_id)
             VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
            [matricule, nom, prenom, age, classe, idUtilisateur]
        );

        return resultat.rows[0].id; // On renvoie l'ID généré pour l'élève créé
    } catch (erreur) {
        console.error("Erreur dans ajouterEleve :", erreur);
        throw erreur;
    }
}

// ==========================
// Lister tous les élèves
// ==========================
export async function listerEleves() {
    try {
        const resultat = await pool.query(`SELECT * FROM students`);
        return resultat.rows;
    } catch (erreur) {
        console.error("Erreur dans listerEleves :", erreur);
        return [];
    }
}

// ==========================
// Récupérer un élève par son id
// ==========================
export async function obtenirEleveParId(id) {
    try {
        const resultat = await pool.query(
            `SELECT * FROM students WHERE id = $1`,
            [id]
        );

        if (resultat.rows.length === 0) {
            return null;
        }

        return resultat.rows[0];
    } catch (erreur) {
        console.error("Erreur dans obtenirEleveParId :", erreur);
        return null;
    }
}

// ==========================
// Récupérer l'élève lié à un compte utilisateur (espace "Mon profil")
// ==========================
export async function obtenirEleveParUtilisateur(idUtilisateur) {
    try {
        const resultat = await pool.query(
            `SELECT * FROM students WHERE user_id = $1`,
            [idUtilisateur]
        );

        if (resultat.rows.length === 0) {
            return null;
        }

        return resultat.rows[0];
    } catch (erreur) {
        console.error("Erreur dans obtenirEleveParUtilisateur :", erreur);
        return null;
    }
}

// ==========================
// Modifier un élève
// ==========================
export async function modifierEleve(id, matricule, nom, prenom, age, classe) {
    try {
        const resultat = await pool.query(
            `UPDATE students
             SET matricule = $1, nom = $2, prenom = $3, age = $4, classe = $5
             WHERE id = $6`,
            [matricule, nom, prenom, age, classe, id]
        );

        return resultat.rowCount; // Nombre de lignes modifiées (0 si l'id n'existe pas)
    } catch (erreur) {
        console.error("Erreur dans modifierEleve :", erreur);
        return 0;
    }
}

// ==========================
// Supprimer un élève
// ==========================
export async function supprimerEleve(id) {
    try {
        const resultat = await pool.query(
            `DELETE FROM students WHERE id = $1`,
            [id]
        );

        return resultat.rowCount; // Nombre de lignes supprimées (0 si l'id n'existe pas)
    } catch (erreur) {
        console.error("Erreur dans supprimerEleve :", erreur);
        return 0;
    }
}

// ==========================
// Vérifier si un matricule existe déjà
// ==========================
export async function matriculeExisteDeja(matricule) {
    try {
        const resultat = await pool.query(
            `SELECT id FROM students WHERE matricule = $1`,
            [matricule]
        );

        return resultat.rows.length > 0; // true si un élève existe déjà avec ce matricule
    } catch (erreur) {
        console.error("Erreur dans matriculeExisteDeja :", erreur);
        return false;
    }
}