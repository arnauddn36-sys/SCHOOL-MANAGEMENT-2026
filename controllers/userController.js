// controllers/userController.js

import {
    listerUtilisateurs,
    ajouterUtilisateur,
    modifierUtilisateur,
    supprimerUtilisateur,
    obtenirUtilisateurParId
} from "../services/userService.js";

// ==========================
// Afficher les utilisateurs
// ==========================
export function obtenirUtilisateurs(requete, reponse) {
    try {
        const utilisateurs = listerUtilisateurs();
        reponse.json(utilisateurs);
    } catch (erreur) {
        console.error(
            "Erreur récupération utilisateurs :",
            erreur
        );
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Afficher un utilisateur par ID
// ==========================
export function obtenirUtilisateurUnique(requete, reponse) {
    try {
        const id = requete.params.id;
        const utilisateur = obtenirUtilisateurParId(id);

        if (!utilisateur) {
            return reponse.status(404).json({
                message: "Utilisateur introuvable"
            });
        }

        reponse.json(utilisateur);
    } catch (erreur) {
        console.error(
            "Erreur récupération utilisateur :",
            erreur
        );
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Ajouter un utilisateur
// ==========================
export function creerUtilisateur(requete, reponse) {
    try {
        const {
            nom,
            prenom,
            password: motDePasse,
            role
        } = requete.body;

        if (!nom || !prenom || !motDePasse || !role) {
            return reponse.status(400).json({
                message: "Tous les champs sont obligatoires"
            });
        }

        // On vérifie le résultat du service avant de répondre
        const resultat = ajouterUtilisateur(
            nom,
            prenom,
            motDePasse,
            role
        );

        if (!resultat) {
            return reponse.status(400).json({
                message: "Ce mot de passe est déjà utilisé, saisissez-en un autre !"
            });
        }

        reponse.json({
            message: "Utilisateur ajouté avec succès"
        });

    } catch (erreur) {
        console.error(
            "Erreur ajout utilisateur :",
            erreur
        );
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Modifier un utilisateur
// ==========================
export function mettreAJourUtilisateur(requete, reponse) {
    try {
        const id = requete.params.id;
        const {
            nom,
            prenom,
            password: motDePasse,
            role
        } = requete.body;

        const resultat = modifierUtilisateur(
            id,
            nom,
            prenom,
            motDePasse,
            role
        );

        if (!resultat) {
            return reponse.status(400).json({
                message: "Ce mot de passe est déjà utilisé, saisissez-en un autre !"
            });
        }

        reponse.json({
            message: "Utilisateur modifié avec succès"
        });

    } catch (erreur) {
        console.error(
            "Erreur modification utilisateur :",
            erreur
        );
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Supprimer un utilisateur
// ==========================
export function retirerUtilisateur(requete, reponse) {
    try {
        const id = requete.params.id;
        const resultat = supprimerUtilisateur(id);

        if (!resultat) {
            return reponse.status(400).json({
                message: "Suppression impossible (dernier administrateur ou utilisateur introuvable)"
            });
        }

        reponse.json({
            message: "Utilisateur supprimé avec succès"
        });

    } catch (erreur) {
        console.error(
            "Erreur suppression utilisateur :",
            erreur
        );

        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}
