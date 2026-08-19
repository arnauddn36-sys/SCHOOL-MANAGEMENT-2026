import bd from "../db/database.js";
import bcrypt from "bcrypt";

const TOURS_DE_SEL = 10;

// ==========================
// Ajouter un utilisateur
// ==========================
export function ajouterUtilisateur(nom, prenom, email, motDePasse, role) {

    // Vérification de l'unicité par nom, prénom et email
    const utilisateurExistant = bd.prepare(`
        SELECT *
        FROM users
        WHERE nom = ? AND prenom = ? AND email = ?
    `).get(nom, prenom, email.trim().toLowerCase());

    if (utilisateurExistant) {
        console.log("Un utilisateur avec ces informations existe déjà.");
        return false;
    }

    const motDePasseHache = bcrypt.hashSync(motDePasse, TOURS_DE_SEL);

    const resultat = bd.prepare(`
        INSERT INTO users (nom, prenom, email, password, role)
        VALUES (?, ?, ?, ?, ?)
    `).run(
        nom,
        prenom,
        email.trim().toLowerCase(),
        motDePasseHache,
        role
    );

    return resultat.lastInsertRowid;
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
        console.log(`Aucun utilisateur trouvé avec l'ID ${id}`);
        return null;
    }

    return utilisateur;
}

// ==========================
// Liste de tous les utilisateurs
// ==========================
export function listerUtilisateurs() {
    return bd.prepare(`SELECT * FROM users`).all();
}

// ==========================
// Modifier un utilisateur
// ==========================
export function modifierUtilisateur(
    id,
    nom,
    prenom,
    email,
    motDePasse,
    role
) {
    const utilisateurExistant = bd.prepare(`
        SELECT *
        FROM users
        WHERE email = ?
        AND id != ?
    `).get(email.trim().toLowerCase(), id);

    if (utilisateurExistant) {
        return false;
    }

    const motDePasseHache = bcrypt.hashSync(motDePasse, TOURS_DE_SEL);

    const resultat = bd.prepare(`
        UPDATE users
        SET nom = ?,
            prenom = ?,
            email = ?,
            password = ?,
            role = ?
        WHERE id = ?
    `).run(
        nom,
        prenom,
        email.trim().toLowerCase(),
        motDePasseHache,
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
// Connexion utilisateur (Nom + Prénom + Email + Mot de passe)
// ==========================
export function trouverUtilisateurParConnexion(
    nom,
    prenom,
    email,
    motDePasse
) {
    // On recherche l'utilisateur en vérifiant simultanément le nom, le prénom et l'email
    const utilisateur = bd.prepare(`
        SELECT *
        FROM users
        WHERE nom = ? AND prenom = ? AND email = ?
    `).get(
        nom.trim(),
        prenom.trim(),
        email.trim().toLowerCase()
    );

    if (!utilisateur) {
        return null; // Aucun utilisateur ne correspond à ces 3 critères
    }

    // Vérification sécurisée du mot de passe avec bcrypt
    const motDePasseValide = bcrypt.compareSync(motDePasse, utilisateur.password);

    if (!motDePasseValide) {

        return null;

    }

    return utilisateur;

}