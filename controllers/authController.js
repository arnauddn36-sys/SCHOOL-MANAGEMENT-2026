// controllers/authController.js

import jwt from "jsonwebtoken";
import { trouverUtilisateurParConnexion } from "../services/userService.js";

// CONNEXION UTILISATEUR

export function connexion(requete, reponse) {

    try {

        // On extrait également l'email du corps de la requête
        const { nom, prenom, email, password: motDePasse } = requete.body;

        // Vérifier les champs (on inclut l'email dans la vérification)
        if (!nom || !prenom || !email || !motDePasse) {

            return reponse.status(400).json({
                message: "Veuillez remplir tous les champs (Nom, Prénom, Email et Mot de passe)"
            });

        }

        // Recherche utilisateur via userService avec les 4 critères
        const utilisateur = trouverUtilisateurParConnexion(
            nom,
            prenom,
            email,
            motDePasse
        );

        // Si utilisateur introuvable ou informations incorrectes
        // Message volontairement générique : on ne précise jamais QUEL champ
        // est en cause (ça permettrait à quelqu'un de deviner si un email
        // existe déjà dans la base, information sensible).
        if (!utilisateur) {

            return reponse.status(401).json({
                message: "Informations de connexion incorrectes"
            });

        }

        // Sécurité critique : si JWT_SECRET n'est pas défini (.env absent ou
        // mal chargé), on refuse de démarrer plutôt que d'utiliser un secret
        // de secours écrit en dur dans le code (qui serait visible de tous
        // sur GitHub et permettrait de forger de faux tokens admin).
        if (!process.env.JWT_SECRET) {

            console.error("JWT_SECRET manquant : vérifie que le fichier .env existe et que dotenv est chargé dans server.js");

            return reponse.status(500).json({
                message: "Erreur serveur"
            });

        }

        // Génération du token JWT
        const token = jwt.sign(
            {
                id: utilisateur.id,
                nom: utilisateur.nom,
                prenom: utilisateur.prenom,
                email: utilisateur.email,
                role: utilisateur.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        // Réponse envoyée au frontend
        return reponse.json({

            success: true,

            message: "Connexion réussie",

            token,

            // On renvoie l'utilisateur (avec son id et son email si besoin côté front)
            user: {
                id: utilisateur.id,
                nom: utilisateur.nom,
                prenom: utilisateur.prenom,
                email: utilisateur.email,
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