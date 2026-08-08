// utils/permissions.js
// Ce fichier centralise le contrôle d'accès par rôle (RBAC) pour l'API Express.
// Le frontend envoie le rôle de l'utilisateur connecté dans l'en-tête "x-role"
// (voir public/js/api.js). Ce n'est pas un vrai système de sécurité (le rôle
// pourrait être falsifié par un utilisateur avancé), mais cela suffit pour ce
// projet pédagogique afin de distinguer clairement les vues admin / professeur / élève.

// Vérifie simplement qu'une requête vient d'un utilisateur connecté (rôle présent)
export function exigerConnexion(requete, reponse, suivant) {
    const role = requete.headers["x-role"]; // Rôle envoyé par le frontend après connexion

    if (!role) {
        return reponse.status(401).json({
            message: "Connexion requise"
        });
    }

    requete.userRole = role;       // On stocke le rôle pour les prochains middlewares/contrôleurs
    requete.userId = requete.headers["x-user-id"] ? Number(requete.headers["x-user-id"]) : null;
    suivant(); // On laisse passer la requête vers la suite
}

// Fabrique un middleware qui n'autorise que les rôles listés en paramètre
// Exemple : routeur.get("/", autoriser("admin", "teacher"), obtenirEleves);
export function autoriser(...rolesAutorises) {

    return function (requete, reponse, suivant) {

        const role = requete.headers["x-role"]; // Rôle transmis par le frontend

        if (!role) {
            return reponse.status(401).json({
                message: "Connexion requise"
            });
        }

        if (!rolesAutorises.includes(role)) {
            return reponse.status(403).json({
                message: "Accès refusé pour votre rôle"
            });
        }

        requete.userRole = role; // Rôle disponible dans les contrôleurs suivants
        requete.userId = requete.headers["x-user-id"] ? Number(requete.headers["x-user-id"]) : null;
        suivant(); // Rôle autorisé, on continue vers le contrôleur
    };
}
