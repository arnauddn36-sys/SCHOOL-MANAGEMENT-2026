// public/js/auth.js
// Module partagé qui gère la session de l'utilisateur connecté côté navigateur.
// On utilise localStorage (et non un vrai système de session serveur) car ce
// projet n'a pas de gestion de token : c'est suffisant pour un projet pédagogique.

const CLE_STOCKAGE = "schoolManagementUser"; // Clé utilisée dans le localStorage

// Enregistre l'utilisateur connecté après une connexion réussie
export function enregistrerUtilisateur(utilisateur) {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(utilisateur)); // On sérialise l'objet en texte
}

// Récupère l'utilisateur actuellement connecté (ou null si personne n'est connecté)
export function obtenirUtilisateur() {
    const brut = localStorage.getItem(CLE_STOCKAGE); // On lit la chaîne stockée

    if (!brut) {
        return null; // Aucun utilisateur enregistré
    }

    try {
        return JSON.parse(brut); // On reconvertit le texte en objet JavaScript
    } catch {
        return null; // Donnée corrompue : on considère qu'il n'y a pas d'utilisateur
    }
}

// Supprime la session (utilisé lors de la déconnexion)
export function effacerUtilisateur() {
    localStorage.removeItem(CLE_STOCKAGE); // On efface l'entrée du localStorage
}

// Protège une page : redirige vers la connexion si personne n'est connecté,
// ou vers le bon tableau de bord si le rôle ne correspond pas à la page.
export function exigerRole(roleAttendu) {

    const utilisateur = obtenirUtilisateur(); // On récupère la session actuelle

    if (!utilisateur) {
        window.location.href = "/html/index.html"; // Pas connecté -> retour au login
        return null;
    }

    if (utilisateur.role !== roleAttendu) {
        window.location.href = `/html/${utilisateur.role}.html`; // Mauvais tableau de bord -> le bon
        return null;
    }

    return utilisateur; // Utilisateur valide pour cette page
}

// Déconnecte l'utilisateur et le renvoie vers la page de connexion
export function deconnexion() {
    effacerUtilisateur();                      // On efface la session locale
    window.location.href = "/html/index.html"; // On revient à l'écran de connexion
}
