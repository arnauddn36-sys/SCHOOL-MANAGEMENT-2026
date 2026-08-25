import pool from "../db/database.js";
import bcrypt from "bcrypt";

const TOURS_DE_SEL = 10;

// ==========================
// Ajouter un utilisateur
// ==========================
export async function ajouterUtilisateur(nom, prenom, email, motDePasse, role) {
    try {
        // Vérification de l'unicité par nom, prénom et email
        const verif = await pool.query(
            `SELECT * FROM users WHERE LOWER(nom) = LOWER($1) AND LOWER(prenom) = LOWER($2) AND email = $3`,
            [nom.trim(), prenom.trim(), email.trim().toLowerCase()]
        );

        if (verif.rows.length > 0) {
            console.log("Un utilisateur avec ces informations existe déjà.");
            return false;
        }

        const motDePasseHache = await bcrypt.hash(motDePasse, TOURS_DE_SEL);

        const resultat = await pool.query(
            `INSERT INTO users (nom, prenom, email, password, role)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [nom.trim(), prenom.trim(), email.trim().toLowerCase(), motDePasseHache, role]
        );

        return resultat.rows[0].id;
    } catch (erreur) {
        console.error("Erreur dans ajouterUtilisateur :", erreur);
        return false;
    }
}

// ==========================
// Récupérer un utilisateur par ID
// ==========================
export async function obtenirUtilisateurParId(id) {
    try {
        const resultat = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

        if (resultat.rows.length === 0) {
            console.log(`Aucun utilisateur trouvé avec l'ID ${id}`);
            return null;
        }

        return resultat.rows[0];
    } catch (erreur) {
        console.error("Erreur dans obtenirUtilisateurParId :", erreur);
        return null;
    }
}

// ==========================
// Liste de tous les utilisateurs
// ==========================
export async function listerUtilisateurs() {
    try {
        const resultat = await pool.query(`SELECT * FROM users`);
        return resultat.rows;
    } catch (erreur) {
        console.error("Erreur dans listerUtilisateurs :", erreur);
        return [];
    }
}

// ==========================
// Modifier un utilisateur
// ==========================
export async function modifierUtilisateur(id, nom, prenom, email, motDePasse, role) {
    try {
        const utilisateurExistant = await pool.query(
            `SELECT * FROM users WHERE email = $1 AND id != $2`,
            [email.trim().toLowerCase(), id]
        );

        if (utilisateurExistant.rows.length > 0) {
            return false;
        }

        const motDePasseHache = await bcrypt.hash(motDePasse, TOURS_DE_SEL);

        const resultat = await pool.query(
            `UPDATE users
             SET nom = $1, prenom = $2, email = $3, password = $4, role = $5
             WHERE id = $6`,
            [nom.trim(), prenom.trim(), email.trim().toLowerCase(), motDePasseHache, role, id]
        );

        return resultat.rowCount > 0;
    } catch (erreur) {
        console.error("Erreur dans modifierUtilisateur :", erreur);
        return false;
    }
}

// ==========================
// Supprimer un utilisateur
// ==========================
export async function supprimerUtilisateur(id) {
    try {
        const utilisateurRes = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

        if (utilisateurRes.rows.length === 0) {
            return false;
        }

        const utilisateur = utilisateurRes.rows[0];

        // Protection du dernier administrateur
        if (utilisateur.role === "admin") {
            const adminRes = await pool.query(`SELECT COUNT(*) AS total FROM users WHERE role = 'admin'`);
            if (parseInt(adminRes.rows[0].total) <= 1) {
                return false;
            }
        }

        const resultat = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

        return resultat.rowCount > 0;
    } catch (erreur) {
        console.error("Erreur dans supprimerUtilisateur :", erreur);
        return false;
    }
}

// ==========================
// Connexion utilisateur
// ==========================
export async function trouverUtilisateurParConnexion(nom, prenom, email, motDePasse) {
    try {
        const resultat = await pool.query(
            `SELECT * FROM users WHERE LOWER(nom) = LOWER($1) AND LOWER(prenom) = LOWER($2) AND email = $3`,
            [nom.trim(), prenom.trim(), email.trim().toLowerCase()]
        );

        if (resultat.rows.length === 0) {
            return null;
        }

        const utilisateur = resultat.rows[0];

        const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.password);

        if (!motDePasseValide) {
            return null;
        }

        return utilisateur;
    } catch (erreur) {
        console.error("Erreur dans trouverUtilisateurParConnexion :", erreur);
        return null;
    }
}