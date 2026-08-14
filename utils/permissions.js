// utils/permissions.js
// Contrôle d'accès par rôle (RBAC) pour l'API Express, basé sur un vrai JWT.
// Le frontend doit envoyer le token reçu à la connexion dans l'en-tête :
//   Authorization: Bearer <token>
// Contrairement à l'ancien système (en-tête x-role lisible/modifiable par
// n'importe qui via les DevTools du navigateur), le rôle est ici extrait
// du token signé par le serveur : un utilisateur ne peut pas le falsifier
// sans connaître JWT_SECRET.

import jwt from "jsonwebtoken";

// Vérifie simplement qu'une requête vient d'un utilisateur connecté (token valide)
export function exigerConnexion(requete, reponse, suivant) {

    const contenuToken = verifierEtDecoderToken(requete, reponse);

    if (!contenuToken) {
        return; // La réponse d'erreur a déjà été envoyée par verifierEtDecoderToken
    }

    requete.userRole = contenuToken.role; // Rôle disponible pour les prochains middlewares/contrôleurs
    requete.userId = contenuToken.id;
    suivant();

}

// Fabrique un middleware qui n'autorise que les rôles listés en paramètre
// Exemple : routeur.get("/", autoriser("admin", "teacher"), obtenirEleves);
export function autoriser(...rolesAutorises) {

    return function (requete, reponse, suivant) {

        const contenuToken = verifierEtDecoderToken(requete, reponse);

        if (!contenuToken) {
            return; // La réponse d'erreur a déjà été envoyée par verifierEtDecoderToken
        }

        if (!rolesAutorises.includes(contenuToken.role)) {

            return reponse.status(403).json({
                message: "Accès refusé pour votre rôle"
            });

        }

        requete.userRole = contenuToken.role; // Rôle disponible dans les contrôleurs suivants
        requete.userId = contenuToken.id;
        suivant(); // Rôle autorisé, on continue vers le contrôleur

    };

}

// Fonction interne : extrait le token de l'en-tête Authorization, le vérifie
// (signature + expiration) et renvoie son contenu décodé, ou envoie directement
// la réponse d'erreur appropriée et renvoie null si le token est absent/invalide.
function verifierEtDecoderToken(requete, reponse) {

    const enTeteAuthorization = requete.headers["authorization"];

    if (!enTeteAuthorization || !enTeteAuthorization.startsWith("Bearer ")) {

        reponse.status(401).json({
            message: "Connexion requise"
        });

        return null;

    }

    const token = enTeteAuthorization.split(" ")[1];

    try {

        return jwt.verify(token, process.env.JWT_SECRET);

    } catch (erreur) {

        if (erreur.name === "TokenExpiredError") {

            reponse.status(401).json({
                message: "Session expirée, veuillez vous reconnecter"
            });

            return null;

        }

        reponse.status(401).json({
            message: "Token invalide"
        });

        return null;

    }

}