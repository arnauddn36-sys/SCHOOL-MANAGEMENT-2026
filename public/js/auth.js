// public/js/auth.js
// Module partagé qui gère la session de l'utilisateur connecté côté navigateur.
// On stocke à la fois l'utilisateur (pour l'affichage) et le token JWT
// (pour prouver l'identité auprès du serveur sur chaque requête protégée).
// On programme aussi une déconnexion automatique pile à l'expiration du token,
// pour ne pas laisser l'utilisateur croire qu'il est encore connecté.

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

// ==========================
// GESTION DE L'EXPIRATION DU TOKEN
// ==========================

// Décode le "payload" d'un token JWT (partie centrale, entre les deux points),
// sans vérifier sa signature : on ne fait pas confiance à ce contenu pour la
// sécurité (le serveur revérifie toujours), on l'utilise juste pour lire la
// date d'expiration côté affichage.
function decoderPayloadToken(token) {

    try {

        const partiePayload = token.split(".")[1];         // Le JWT a 3 parties séparées par des points
        const jsonDecode = atob(partiePayload.replace(/-/g, "+").replace(/_/g, "/"));

        return JSON.parse(jsonDecode);

    } catch {

        return null; // Token mal formé : on considère qu'il n'y a pas d'infos exploitables

    }

}

// Renvoie la date d'expiration du token (objet Date), ou null si illisible
function obtenirDateExpirationToken(token) {

    const payload = decoderPayloadToken(token);

    if (!payload || !payload.exp) {
        return null;
    }

    return new Date(payload.exp * 1000); // "exp" est en secondes Unix, Date attend des millisecondes

}

let minuteurDeconnexionAutomatique = null; // Référence au setTimeout en cours, pour pouvoir l'annuler

// Programme une déconnexion automatique pile au moment où le token expirera.
// À appeler à chaque chargement de page protégée (voir exigerRole ci-dessous).
export function programmerDeconnexionAutomatique() {

    // On annule un éventuel minuteur précédent pour ne pas en empiler plusieurs
    if (minuteurDeconnexionAutomatique) {
        clearTimeout(minuteurDeconnexionAutomatique);
    }

    const token = obtenirToken();

    if (!token) {
        return;
    }

    const dateExpiration = obtenirDateExpirationToken(token);

    if (!dateExpiration) {
        return; // Token illisible : on laisse le serveur gérer via les réponses 401
    }

    const millisecondesAvantExpiration = dateExpiration.getTime() - Date.now();

    // Le token est déjà expiré (ex: onglet resté ouvert très longtemps) : déconnexion immédiate
    if (millisecondesAvantExpiration <= 0) {
        deconnexion();
        return;
    }

    // setTimeout se déclenchera automatiquement pile à l'expiration, même si
    // l'utilisateur ne fait aucune action entre-temps.
    minuteurDeconnexionAutomatique = setTimeout(() => {
        deconnexion();
    }, millisecondesAvantExpiration);

}

// Protège une page : redirige vers la connexion si personne n'est connecté,
// vers le bon tableau de bord si le rôle ne correspond pas, ou déconnecte
// immédiatement si le token stocké est déjà expiré.
export function exigerRole(roleAttendu) {

    const utilisateur = obtenirUtilisateur();
    const token = obtenirToken();

    if (!utilisateur || !token) {
        window.location.href = "/html/index.html"; // Pas connecté -> retour au login
        return null;
    }

    const dateExpiration = obtenirDateExpirationToken(token);

    if (dateExpiration && dateExpiration.getTime() <= Date.now()) {
        deconnexion(); // Token déjà expiré (session trop ancienne) -> déconnexion immédiate
        return null;
    }

    if (utilisateur.role !== roleAttendu) {
        window.location.href = `/html/${utilisateur.role}.html`; // Mauvais tableau de bord -> le bon
        return null;
    }

    // La page est valide pour cet utilisateur : on programme la déconnexion
    // automatique pour le moment exact où son token expirera.
    programmerDeconnexionAutomatique();

    return utilisateur;
}

// Déconnecte l'utilisateur et le renvoie vers la page de connexion
export function deconnexion() {

    if (minuteurDeconnexionAutomatique) {
        clearTimeout(minuteurDeconnexionAutomatique);
        minuteurDeconnexionAutomatique = null;
    }

    effacerUtilisateur();
    window.location.href = "/html/index.html";
}