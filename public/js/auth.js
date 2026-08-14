// public/js/auth.js
// Module partagé qui gère la session de l'utilisateur connecté côté navigateur.
// On stocke à la fois l'utilisateur (pour l'affichage) et le token JWT
// (pour prouver l'identité auprès du serveur sur chaque requête protégée).

const CLE_STOCKAGE_UTILISATEUR = "schoolManagementUser";  // Clé pour l'objet utilisateur
const CLE_STOCKAGE_TOKEN = "schoolManagementToken";        // Clé pour le token JWT

// Enregistre l'utilisateur ET son token après une connexion réussie
export function enregistrerUtilisateur(utilisateur, token) {
    localStorage.setItem(CLE_STOCKAGE_UTILISATEUR, JSON.stringify(utilisateur));
    localStorage.setItem(CLE_STOCKAGE_TOKEN, token);
}

// Récupère l'utilisateur actuellement connecté (ou null si personne n'est connecté)
export function obtenirUtilisateur() {
    const brut = localStorage.getItem(CLE_STOCKAGE_UTILISATEUR);

    if (!brut) {
        return null;
    }

    try {
        return JSON.parse(brut);
    } catch {
        return null; // Donnée corrompue : on considère qu'il n'y a pas d'utilisateur
    }
}

// Récupère le token JWT actuellement stocké (ou null si absent)
export function obtenirToken() {
    return localStorage.getItem(CLE_STOCKAGE_TOKEN);
}

// Supprime la session (utilisateur + token), utilisé lors de la déconnexion
export function effacerUtilisateur() {
    localStorage.removeItem(CLE_STOCKAGE_UTILISATEUR);
    localStorage.removeItem(CLE_STOCKAGE_TOKEN);
}

// Protège une page : redirige vers la connexion si personne n'est connecté,
// ou vers le bon tableau de bord si le rôle ne correspond pas à la page.
export function exigerRole(roleAttendu) {

    const utilisateur = obtenirUtilisateur();
    const token = obtenirToken();

    if (!utilisateur || !token) {
        window.location.href = "/html/index.html"; // Pas connecté -> retour au login
        return null;
    }

    if (utilisateur.role !== roleAttendu) {
        window.location.href = `/html/${utilisateur.role}.html`; // Mauvais tableau de bord -> le bon
        return null;
    }

    return utilisateur;
}

// Déconnecte l'utilisateur et le renvoie vers la page de connexion
export function deconnexion() {
    effacerUtilisateur();
    window.location.href = "/html/index.html";
}