// controllers/authController.js

import jwt from "jsonwebtoken";
import { trouverUtilisateurParConnexion, ajouterUtilisateur } from "../services/userService.js";
import { ajouterEleve, matriculeExisteDeja } from "../services/studentService.js";

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

// ==========================
// INSCRIPTION (élève uniquement)
// ==========================
// Point d'accès public d'auto-inscription. Le rôle est TOUJOURS forcé à
// "student" ici, quoi que le frontend envoie dans le corps de la requête :
// jamais faire confiance à un rôle fourni par le client. Les comptes admin
// et professeur ne peuvent être créés que par un admin déjà connecté,
// via le dashboard (teachersPanel.js).
export function inscription(requete, reponse) {

    try {

        const { nom, prenom, email, matricule, age, classe, password: motDePasse, confirmationMotDePasse } = requete.body;

        if (!nom || !prenom || !email || !matricule || !age || !classe || !motDePasse || !confirmationMotDePasse) {

            return reponse.status(400).json({
                message: "Veuillez remplir tous les champs"
            });

        }

        if (motDePasse !== confirmationMotDePasse) {

            return reponse.status(400).json({
                message: "Les mots de passe ne correspondent pas"
            });

        }

        if (motDePasse.length < 6) {

            return reponse.status(400).json({
                message: "Le mot de passe doit contenir au moins 6 caractères"
            });

        }

        // On vérifie le matricule AVANT de créer le compte utilisateur.
        // Ces matricules sont des identifiants officiels (liés à la base de
        // l'État ivoirien), donc l'unicité doit être garantie et vérifiée en
        // premier : mieux vaut refuser l'inscription proprement que de créer
        // un compte "orphelin" (connectable mais sans fiche élève valide).
        if (matriculeExisteDeja(matricule.trim())) {

            return reponse.status(409).json({
                message: "Ce matricule est déjà associé à un compte existant"
            });

        }

        // ajouterUtilisateur() valide déjà le format Gmail et l'unicité de
        // l'email en interne (voir services/userService.js) ; elle hashe
        // aussi le mot de passe avec bcrypt avant de l'enregistrer.
        // Elle renvoie maintenant l'id du compte créé (ou false en cas d'échec).
        const idUtilisateur = ajouterUtilisateur(nom, prenom, email, motDePasse, "student");

        if (!idUtilisateur) {

            return reponse.status(409).json({
                message: "Cet email est invalide ou déjà utilisé"
            });

        }

        // On crée immédiatement la fiche élève liée à ce compte (via user_id).
        // Le matricule a déjà été vérifié comme disponible juste au-dessus,
        // donc ce try/catch reste une sécurité supplémentaire (ex: double
        // inscription simultanée avec le même matricule, cas rare mais possible).
        try {

            ajouterEleve(matricule.trim(), nom, prenom, Number(age), classe, idUtilisateur);

        } catch (erreurMatricule) {

            console.error("Erreur création fiche élève :", erreurMatricule);

            return reponse.status(409).json({
                message: "Ce matricule vient d'être utilisé par quelqu'un d'autre. Votre compte a été créé ; contactez un administrateur pour lier votre fiche élève."
            });

        }

        return reponse.status(201).json({
            success: true,
            message: "Compte créé avec succès. Vous pouvez maintenant vous connecter."
        });

    } catch (erreur) {

        console.error(
            "Erreur inscription :",
            erreur
        );

        return reponse.status(500).json({
            message: "Erreur serveur"
        });

    }

}