// controllers/studentController.js
// Reçoit les requêtes HTTP liées aux élèves et appelle le service correspondant.

import {
    listerEleves,
    obtenirEleveParId,
    obtenirEleveParUtilisateur,
    ajouterEleve,
    modifierEleve,
    supprimerEleve
} from "../services/studentService.js";

import { listerNotesParEleve } from "../services/gradeService.js";
import { listerAbsencesParEleve } from "../services/absenceService.js";

// ==========================
// Afficher les élèves
// ==========================
export function obtenirEleves(requete, reponse) {

    try {

        const eleves = listerEleves();

        reponse.json(eleves);

    } catch (erreur) {

        console.error("Erreur récupération élèves :", erreur);

        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Afficher un élève par ID
// ==========================
export function obtenirEleveUnique(requete, reponse) {

    try {

        const id = requete.params.id;

        const eleve = obtenirEleveParId(id);

        if (!eleve) {
            return reponse.status(404).json({
                message: "Élève introuvable"
            });
        }

        reponse.json(eleve);

    } catch (erreur) {

        console.error("Erreur récupération élève :", erreur);

        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Afficher le profil de l'élève connecté (via son user_id)
// avec ses notes et absences pour l'espace élève
// ==========================
export function obtenirMonProfilEleve(requete, reponse) {

    try {

        const eleve = obtenirEleveParUtilisateur(requete.userId);

        if (!eleve) {
            return reponse.status(404).json({
                message: "Aucun profil élève relié à ce compte"
            });
        }

        const notes = listerNotesParEleve(eleve.id);        // Notes de l'élève
        const absences = listerAbsencesParEleve(eleve.id);   // Absences de l'élève

        reponse.json({ ...eleve, grades: notes, absences });

    } catch (erreur) {

        console.error("Erreur récupération profil élève :", erreur);

        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Ajouter un élève
// ==========================
export function creerEleve(requete, reponse) {

    try {

        const { matricule, nom, prenom, age, classe } = requete.body;

        if (!matricule || !nom || !prenom || !age || !classe) {
            return reponse.status(400).json({
                message: "Tous les champs sont obligatoires"
            });
        }

        ajouterEleve(matricule, nom, prenom, age, classe);

        reponse.json({
            message: "Élève ajouté avec succès"
        });

    } catch (erreur) {

        console.error("Erreur ajout élève :", erreur);

        reponse.status(500).json({
            message: "Erreur serveur (matricule peut-être déjà utilisé)"
        });
    }
}

// ==========================
// Modifier un élève
// ==========================
export function mettreAJourEleve(requete, reponse) {

    try {

        const id = requete.params.id;
        const { matricule, nom, prenom, age, classe } = requete.body;

        const modifications = modifierEleve(id, matricule, nom, prenom, age, classe);

        if (modifications === 0) {
            return reponse.status(404).json({
                message: "Élève introuvable"
            });
        }

        reponse.json({
            message: "Élève modifié avec succès"
        });

    } catch (erreur) {

        console.error("Erreur modification élève :", erreur);

        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Supprimer un élève
// ==========================
export function retirerEleve(requete, reponse) {

    try {

        const id = requete.params.id;

        const suppressions = supprimerEleve(id);

        if (suppressions === 0) {
            return reponse.status(404).json({
                message: "Élève introuvable"
            });
        }

        reponse.json({
            message: "Élève supprimé avec succès"
        });

    } catch (erreur) {

        console.error("Erreur suppression élève :", erreur);

        reponse.status(500).json({
            message: "Erreur serveur"
        });
    }
}
