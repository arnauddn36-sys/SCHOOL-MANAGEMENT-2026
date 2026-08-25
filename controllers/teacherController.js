// controllers/teacherController.js

import {
    listerProfesseurs,
    ajouterProfesseur,
    modifierProfesseur,
    supprimerProfesseur,
    attribuerMatiere,
    listerMatieresDisponibles,
    obtenirProfesseurParUtilisateur
} from "../services/teacherService.js";

// ==========================
// Afficher les professeurs
// ==========================
export async function obtenirProfesseurs(requete, reponse) {
    try {
        const professeurs = await listerProfesseurs();
        reponse.json(professeurs);
    } catch(erreur) {
        console.error(
            "Erreur récupération professeurs :",
            erreur
        );
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Ajouter un professeur
// ==========================
export async function creerProfesseur(requete, reponse) {
    try {
        const { nom, prenom } = requete.body;

        if(!nom || !prenom){
            return reponse.status(400).json({
                message: "Nom et prénom obligatoires"
            });
        }

        await ajouterProfesseur(nom, prenom);

        reponse.json({
            message: "Professeur ajouté avec succès"
        });
    } catch(erreur) {
        console.error(
            "Erreur ajout professeur :",
            erreur
        );
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Modifier un professeur
// ==========================
export async function mettreAJourProfesseur(requete, reponse) {
    try {
        const id = requete.params.id;
        const { nom, prenom } = requete.body;

        await modifierProfesseur(id, nom, prenom);

        reponse.json({
            message: "Professeur modifié"
        });
    } catch(erreur) {
        console.error(erreur);
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Supprimer un professeur
// ==========================
export async function retirerProfesseur(requete, reponse) {
    try {
        const id = requete.params.id;

        await supprimerProfesseur(id);

        reponse.json({
            message: "Professeur supprimé"
        });
    } catch(erreur) {
        console.error(erreur);
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Assigner une matière
// ==========================
export async function attribuerMatiereProfesseur(requete, reponse) {
    try {
        const {
            teacherId: idProfesseur,
            subjectId: idMatiere
        } = requete.body;

        await attribuerMatiere(idProfesseur, idMatiere);

        reponse.json({
            message: "Matière attribuée au professeur"
        });
    } catch(erreur) {
        console.error(erreur);
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Profil du professeur connecté (via son user_id)
// ==========================
export async function obtenirMonProfilProfesseur(requete, reponse) {
    try {
        const professeur = await obtenirProfesseurParUtilisateur(requete.userId);

        if (!professeur) {
            return reponse.status(404).json({
                message: "Aucun profil professeur relié à ce compte"
            });
        }

        reponse.json(professeur);
    } catch (erreur) {
        console.error("Erreur récupération profil professeur :", erreur);
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// Liste des matières
export async function obtenirMatieres(requete, reponse) {
    try {
        const matieres = await listerMatieresDisponibles();
        reponse.json(matieres);
    } catch(erreur) {
        console.error(erreur);
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}