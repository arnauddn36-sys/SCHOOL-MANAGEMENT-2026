import {
    listerNotes,
    listerNotesParEleve,
    ajouterNote,
    modifierNote,
    supprimerNote
} from "../services/gradeService.js";

// Liste des notes

export function obtenirNotes(requete,reponse){

    try{

        const notes = listerNotes();

        reponse.json(notes);

    }catch(erreur){

        console.error(erreur);

        reponse.status(500).json({
            message:"Erreur serveur"
        });

    }

}

// Notes d'un élève précis

export function obtenirNotesEleve(requete,reponse){

    try{

        const notes = listerNotesParEleve(requete.params.id);

        reponse.json(notes);

    }catch(erreur){

        console.error(erreur);

        reponse.status(500).json({
            message:"Erreur serveur"
        });

    }

}

// Ajouter une note

export function creerNote(requete,reponse){

    try{

        const {
            student_id: idEleve,
            subject_id: idMatiere,
            note
        } = requete.body;

        ajouterNote(
            idEleve,
            idMatiere,
            note
        );

        reponse.json({

            message:"Note ajoutée avec succès"

        });

    }catch(erreur){

        console.error(erreur);

        reponse.status(500).json({

            message:"Erreur serveur"

        });

    }

}

// Modifier

export function mettreAJourNote(requete,reponse){

    try{

        const id = requete.params.id;

        const {
            student_id: idEleve,
            subject_id: idMatiere,
            note
        } = requete.body;

        modifierNote(
            id,
            idEleve,
            idMatiere,
            note
        );

        reponse.json({

            message:"Note modifiée"

        });

    }catch(erreur){

        reponse.status(500).json({
            message:"Erreur serveur"
        });

    }

}

// Supprimer

export function retirerNote(requete,reponse){

    try{

        const id = requete.params.id;

        supprimerNote(id);

        reponse.json({

            message:"Note supprimée"

        });

    }catch(erreur){

        reponse.status(500).json({

            message:"Erreur serveur"

        });

    }

}
