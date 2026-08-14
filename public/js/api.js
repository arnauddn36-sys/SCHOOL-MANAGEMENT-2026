// public/js/api.js
// Module partagé qui centralise tous les appels à l'API. Il ajoute automatiquement
// l'en-tête "Authorization: Bearer <token>" utilisé par le middleware RBAC du
// serveur (voir utils/permissions.js), pour éviter de le répéter dans chaque panneau.
// Le rôle n'est plus envoyé directement par le frontend : il est extrait par le
// serveur depuis le token signé, donc impossible à falsifier depuis le navigateur.

import { obtenirToken, deconnexion } from "./auth.js";

// Construit les en-têtes communs à chaque requête (JSON + token d'authentification)
function construireEntetes() {

    const token = obtenirToken(); // Token JWT de l'utilisateur actuellement connecté

    const entetes = {
        "Content-Type": "application/json" // Le corps des requêtes est toujours du JSON
    };

    if (token) {
        entetes["Authorization"] = `Bearer ${token}`; // Preuve d'identité vérifiable par le serveur
    }

    return entetes;
}

// Fonction interne qui exécute la requête et gère les erreurs communes
async function executerRequete(url, options = {}) {

    const reponse = await fetch(url, {
        ...options,                    // Méthode, corps, etc. fournis par l'appelant
        headers: construireEntetes()   // En-têtes d'authentification ajoutés automatiquement
    });

    if (reponse.status === 401) {
        deconnexion(); // Session invalide ou expirée -> on renvoie vers la connexion
        return null;
    }

    const donnees = await reponse.json().catch(() => null); // On tente de lire le JSON

    if (!reponse.ok) {
        // On transforme les erreurs HTTP en erreurs JS classiques, avec le message serveur
        throw new Error(donnees?.message || "Erreur serveur");
    }

    return donnees; // Résultat exploitable par l'appelant
}

// Raccourcis pour chaque verbe HTTP utilisé dans l'application
export const api = {
    get:    (url)          => executerRequete(url, { method: "GET" }),
    post:   (url, corps)   => executerRequete(url, { method: "POST", body: JSON.stringify(corps) }),
    put:    (url, corps)   => executerRequete(url, { method: "PUT", body: JSON.stringify(corps) }),
    delete: (url)          => executerRequete(url, { method: "DELETE" })
};