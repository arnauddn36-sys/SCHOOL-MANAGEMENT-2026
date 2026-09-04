// controllers/subjectController.js
import {
    listerMatieres,
    ajouterMatiere,
    modifierMatiere,
    supprimerMatiere
} from "../services/subjectService.js";

// Afficher les matières

export async function obtenirMatieres(requete, reponse) {
    try {
        const matieres = await listerMatieres();
        reponse.json(matieres);
    } catch (erreur) {
        console.error(erreur);
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// Ajouter une matière


export async function creerMatiere(requete, reponse) {
    try {
        const { nom, coefficient } = requete.body;

        if (!nom) {
            return reponse.status(400).json({
                message: "Nom obligatoire"
            });
        }

        await ajouterMatiere(nom, coefficient);

        reponse.json({
            success: true,
            message: "Matière ajoutée avec succès"
        });
    } catch (erreur) {
        console.error(erreur);
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// Modifier une matière

export async function mettreAJourMatiere(requete, reponse) {
    try {
        const id = requete.params.id;
        const { nom, coefficient } = requete.body;

        await modifierMatiere(id, nom, coefficient);

        reponse.json({ 
            success: true, 
            message: "Matière modifiée avec succès" 
        });
    } catch (erreur) {
        console.error("Erreur mise à jour matière :", erreur);
        reponse.status(500).json({ 
            success: false, 
            message: "Erreur lors de la modification de la matière" 
        });
    }
}

// Supprimer une matière

export async function retirerMatiere(requete, reponse) {
    try {
        const id = requete.params.id;

        await supprimerMatiere(id);

        reponse.json({
            success: true,
            message: "Matière supprimée avec succès"
        });
    } catch (erreur) {
        console.error(erreur);
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}