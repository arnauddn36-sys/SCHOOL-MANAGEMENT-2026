// controllers/authController.js

import { trouverUtilisateurParConnexion } from "../services/userService.js";

// CONNEXION UTILISATEUR

export function connexion(requete, reponse) {

    try {

        const { nom, prenom, password: motDePasse } = requete.body;

        // Vérifier les champs
        if (!nom || !prenom || !motDePasse) {

            return reponse.status(400).json({
                message: "Veuillez remplir tous les champs"
            });

        }

        // Recherche utilisateur via userService
        const utilisateur = trouverUtilisateurParConnexion(
            nom,
            prenom,
            motDePasse
        );

        // Si utilisateur introuvable
        if (!utilisateur) {

            return reponse.status(401).json({
                message: "Nom, prénom ou mot de passe incorrect"
            });

        }

        // Réponse envoyée au frontend

        return reponse.json({

            success: true,

            message: "Connexion réussie",

            // On renvoie l'utilisateur (sans le mot de passe) pour que le frontend
            // puisse afficher son nom et l'utiliser pour les futures requêtes (rôle, id).
            user: {
                id: utilisateur.id,
                nom: utilisateur.nom,
                prenom: utilisateur.prenom,
                role: utilisateur.role
            }

        });

    } catch (erreur) {

        console.error(
            "Erreur connexion :",
            erreur
        );

        return reponse.status(500).json({
            message: "Erreur serveur"
        });

    }

}
