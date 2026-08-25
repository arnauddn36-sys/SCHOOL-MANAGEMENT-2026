// controllers/gradeController.js
// Reçoit les requêtes HTTP liées aux notes et appelle le service correspondant.

import {
    listerNotes,
    listerNotesParEleve,
    ajouterNote,
    modifierNote,
    supprimerNote
} from "../services/gradeService.js";

// Liste des notes
export async function obtenirNotes(requete, reponse) {
    try {
        const notes = await listerNotes();
        reponse.json(notes);
    } catch (erreur) {
        console.error(erreur);
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// Notes d'un élève précis
export async function obtenirNotesEleve(requete, reponse) {
    try {
        const notes = await listerNotesParEleve(requete.params.id);
        reponse.json(notes);
    } catch (erreur) {
        console.error(erreur);
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// Ajouter une note
export async function creerNote(requete, reponse) {
    try {
        const {
            student_id: idEleve,
            subject_id: idMatiere,
            note
        } = requete.body;

        await ajouterNote(
            idEleve,
            idMatiere,
            note
        );

        reponse.json({
            message: "Note ajoutée avec succès"
        });
    } catch (erreur) {
        console.error(erreur);
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// Modifier
export async function mettreAJourNote(requete, reponse) {
    try {
        const id = requete.params.id;

        const {
            student_id: idEleve,
            subject_id: idMatiere,
            note
        } = requete.body;

        await modifierNote(
            id,
            idEleve,
            idMatiere,
            note
        );

        reponse.json({
            message: "Note modifiée"
        });
    } catch (erreur) {
        console.error(erreur);
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// Supprimer
export async function retirerNote(requete, reponse) {
    try {
        const id = requete.params.id;

        await supprimerNote(id);

        reponse.json({
            message: "Note supprimée"
        });
    } catch (erreur) {
        console.error(erreur);
        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}