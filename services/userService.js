import bd from "../db/database.js";

// ==========================
// Ajouter un utilisateur
// ==========================

export function ajouterUtilisateur(nom, prenom, motDePasse, role) {

    const utilisateurExistant = bd.prepare(`
        SELECT *
        FROM users
        WHERE password = ?
    `).get(motDePasse);

    if (utilisateurExistant) {

        console.log(
            "Ce mot de passe est déjà utilisé."
        );

        return false;

    }

    bd.prepare(`
        INSERT INTO users (nom, prenom, password, role)
        VALUES (?, ?, ?, ?)
    `).run(
        nom,
        prenom,
        motDePasse,
        role
    );

    return true;

}

// ==========================
// Récupérer un utilisateur par ID
// ==========================

export function obtenirUtilisateurParId(id) {

    const utilisateur = bd.prepare(`
        SELECT *
        FROM users
        WHERE id = ?
    `).get(id);

    if (!utilisateur) {

        console.log(
            `Aucun utilisateur trouvé avec l'ID ${id}`
        );

        return null;

    }

    return utilisateur;

}

// ==========================
// Liste de tous les utilisateurs
// ==========================

export function listerUtilisateurs() {

    const utilisateurs = bd.prepare(`
        SELECT *
        FROM users
    `).all();

    return utilisateurs;

}

// ==========================
// Modifier un utilisateur
// ==========================

export function modifierUtilisateur(
    id,
    nom,
    prenom,
    motDePasse,
    role
) {

    // Vérifier si le mot de passe existe déjà
    const utilisateurExistant = bd.prepare(`
        SELECT *
        FROM users
        WHERE password = ?
        AND id != ?
    `).get(
        motDePasse,
        id
    );

    if (utilisateurExistant) {

        return false;

    }

    const resultat = bd.prepare(`
        UPDATE users
        SET nom = ?,
            prenom = ?,
            password = ?,
            role = ?
        WHERE id = ?
    `).run(
        nom,
        prenom,
        motDePasse,
        role,
        id
    );

    if (resultat.changes === 0) {

        return false;

    }

    return true;

}

// ==========================
// Supprimer un utilisateur
// ==========================

export function supprimerUtilisateur(id) {

    // Chercher l'utilisateur
    const utilisateur = bd.prepare(`
        SELECT *
        FROM users
        WHERE id = ?
    `).get(id);

    if (!utilisateur) {

        return false;

    }

    // Protection du dernier administrateur
    if (utilisateur.role === "admin") {

        const administrateurs = bd.prepare(`
            SELECT COUNT(*) AS total
            FROM users
            WHERE role = 'admin'
        `).get();

        if (administrateurs.total <= 1) {

            return false;

        }

    }

    const resultat = bd.prepare(`
        DELETE FROM users
        WHERE id = ?
    `).run(id);

    if (resultat.changes === 0) {

        return false;

    }

    return true;

}

// ==========================
// Connexion utilisateur
// ==========================

export function trouverUtilisateurParConnexion(
    nom,
    prenom,
    motDePasse
) {

    const utilisateur = bd.prepare(`
        SELECT *
        FROM users
        WHERE nom = ?
        AND prenom = ?
        AND password = ?
    `).get(
        nom,
        prenom,
        motDePasse
    );

    return utilisateur;

}
