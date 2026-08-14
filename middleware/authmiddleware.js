// middleware/authMiddleware.js
// Vérifie le token JWT envoyé par le frontend et protège les routes selon le rôle.

import jwt from "jsonwebtoken";

// Middleware de base : vérifie que le token est présent et valide.
// À utiliser sur TOUTES les routes qui nécessitent d'être connecté.
export function verifierToken(requete, reponse, suivant) {

    // Le frontend doit envoyer le token dans l'en-tête :
    // Authorization: Bearer <token>
    const enTeteAuthorization = requete.headers["authorization"];

    if (!enTeteAuthorization || !enTeteAuthorization.startsWith("Bearer ")) {

        return reponse.status(401).json({
            message: "Accès refusé : aucun token fourni"
        });

    }

    const token = enTeteAuthorization.split(" ")[1];

    try {

        // Vérifie la signature ET l'expiration du token
        const contenuToken = jwt.verify(token, process.env.JWT_SECRET);

        // On attache les infos de l'utilisateur (id, role) à la requête,
        // pour que les routes suivantes puissent les utiliser.
        requete.utilisateur = contenuToken;

        suivant();

    } catch (erreur) {

        if (erreur.name === "TokenExpiredError") {

            return reponse.status(401).json({
                message: "Session expirée, veuillez vous reconnecter"
            });

        }

        return reponse.status(401).json({
            message: "Token invalide"
        });

    }

}

// Middleware de contrôle par rôle : à utiliser APRÈS verifierToken.
// Usage : autoriserRoles("admin") ou autoriserRoles("admin", "teacher")
export function autoriserRoles(...rolesAutorises) {

    return (requete, reponse, suivant) => {

        if (!requete.utilisateur) {

            return reponse.status(401).json({
                message: "Accès refusé : authentification requise"
            });

        }

        if (!rolesAutorises.includes(requete.utilisateur.role)) {

            return reponse.status(403).json({
                message: "Accès refusé : permissions insuffisantes"
            });

        }

        suivant();

    };

}