// controllers/authController.js

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db/database.js"; // Import direct du pool PostgreSQL

// CONNEXION UTILISATEUR
export async function connexion(requete, reponse) {
    try {
        const { nom, prenom, email, password: motDePasse } = requete.body;

        if (!nom || !prenom || !email || !motDePasse) {
            return reponse.status(400).json({
                message: "Veuillez remplir tous les champs (Nom, Prénom, Email et Mot de passe)"
            });
        }

        // Recherche de l'utilisateur dans PostgreSQL
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1 AND LOWER(nom) = LOWER($2) AND LOWER(prenom) = LOWER($3)",
            [email.trim(), nom.trim(), prenom.trim()]
        );

        const utilisateur = result.rows[0];

        if (!utilisateur) {
            return reponse.status(401).json({
                message: "Informations incorrectes, ressaisissez avec les bonnes informations"
            });
        }

        // Vérification du mot de passe hashé avec bcrypt
        const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.password);
        if (!motDePasseValide) {
            return reponse.status(401).json({
                message: "Informations incorrectes, ressaisissez avec les bonnes informations"
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET manquant dans l'environnement");
            return reponse.status(500).json({ message: "Erreur serveur" });
        }

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

        return reponse.json({
            success: true,
            message: "Connexion réussie",
            token,
            user: {
                id: utilisateur.id,
                nom: utilisateur.nom,
                prenom: utilisateur.prenom,
                email: utilisateur.email,
                role: utilisateur.role
            }
        });

    } catch (erreur) {
        console.error("Erreur connexion :", erreur);
        return reponse.status(500).json({ message: "Erreur serveur" });
    }
}

// INSCRIPTION (élève uniquement)
export async function inscription(requete, reponse) {
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

        // Vérifier si le matricule existe déjà
        const verifMatricule = await pool.query("SELECT id FROM students WHERE matricule = $1", [matricule.trim()]);
        if (verifMatricule.rows.length > 0) {
            return reponse.status(409).json({
                message: "Ce matricule est déjà associé à un compte existant"
            });
        }

        // Vérifier si l'email existe déjà
        const verifEmail = await pool.query("SELECT id FROM users WHERE email = $1", [email.trim()]);
        if (verifEmail.rows.length > 0) {
            return reponse.status(409).json({
                message: "Cet email est déjà utilisé"
            });
        }

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(motDePasse, salt);

        // Insérer l'utilisateur
        const newUserQuery = await pool.query(
            `INSERT INTO users (nom, prenom, email, password, role) 
             VALUES ($1, $2, $3, $4, 'student') RETURNING id`,
            [nom.trim(), prenom.trim(), email.trim(), hashedPassword]
        );

        const idUtilisateur = newUserQuery.rows[0].id;

        // Insérer la fiche élève liée
        try {
            await pool.query(
                `INSERT INTO students (matricule, nom, prenom, age, classe, user_id) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [matricule.trim(), nom.trim(), prenom.trim(), Number(age), classe.trim(), idUtilisateur]
            );
        } catch (erreurMatricule) {
            console.error("Erreur création fiche élève :", erreurMatricule);
            return reponse.status(409).json({
                message: "Ce matricule vient d'être utilisé par quelqu'un d'autre. Votre compte a été créé ; contactez un administrateur."
            });
        }

        return reponse.status(201).json({
            success: true,
            message: "Compte créé avec succès. Vous pouvez maintenant vous connecter."
        });

    } catch (erreur) {
        console.error("Erreur inscription :", erreur);
        return reponse.status(500).json({ message: "Erreur serveur" });
    }
}