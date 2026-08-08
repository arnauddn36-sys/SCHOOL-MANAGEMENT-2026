// controllers/absenceController.js
// Reçoit les requêtes HTTP liées aux absences et appelle le service correspondant.

import {
    listerAbsences,
    listerAbsencesParEleve,
    ajouterAbsence,
    modifierAbsence,
    supprimerAbsence
} from "../services/absenceService.js";

import { dateDuJourISO } from "../config/date.js";

// ==========================
// Afficher toutes les absences
// ==========================
export function obtenirAbsences(requete, reponse) {

    try {

        const absences = listerAbsences();

        reponse.json(absences);

    } catch (erreur) {

        console.error("Erreur récupération absences :", erreur);

        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Afficher les absences d'un élève précis
// ==========================
export function obtenirAbsencesEleve(requete, reponse) {

    try {

        const idEleve = requete.params.id;

        const absences = listerAbsencesParEleve(idEleve);

        reponse.json(absences);

    } catch (erreur) {

        console.error("Erreur récupération absences élève :", erreur);

        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Ajouter une absence
// ==========================
export function creerAbsence(requete, reponse) {

    try {

        const { student_id: idEleve, date, status: statut } = requete.body;

        if (!idEleve || !statut) {
            return reponse.status(400).json({
                message: "L'élève et le statut sont obligatoires"
            });
        }

        // Si aucune date n'est fournie, on utilise la date du jour par défaut
        ajouterAbsence(idEleve, date || dateDuJourISO(), statut);

        reponse.json({
            message: "Absence ajoutée avec succès"
        });

    } catch (erreur) {

        console.error("Erreur ajout absence :", erreur);

        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Modifier une absence
// ==========================
export function mettreAJourAbsence(requete, reponse) {

    try {

        const id = requete.params.id;
        const { student_id: idEleve, date, status: statut } = requete.body;

        const modifications = modifierAbsence(id, idEleve, date, statut);

        if (modifications === 0) {
            return reponse.status(404).json({
                message: "Absence introuvable"
            });
        }

        reponse.json({
            message: "Absence modifiée avec succès"
        });

    } catch (erreur) {

        console.error("Erreur modification absence :", erreur);

        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Supprimer une absence
// ==========================
export function retirerAbsence(requete, reponse) {

    try {

        const id = requete.params.id;

        const suppressions = supprimerAbsence(id);

        if (suppressions === 0) {
            return reponse.status(404).json({
                message: "Absence introuvable"
            });
        }

        reponse.json({
            message: "Absence supprimée avec succès"
        });

    } catch (erreur) {

        console.error("Erreur suppression absence :", erreur);

        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}
