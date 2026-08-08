// controllers/subjectController.js

import {

    listerMatieres,
    ajouterMatiere,
    modifierMatiere,
    supprimerMatiere

} from "../services/subjectService.js";

// ==========================
// Afficher les matières
// ==========================

export function obtenirMatieres(requete,reponse){

    try{

        const matieres = listerMatieres();

        reponse.json(matieres);

    }catch(erreur){

        console.error(erreur);

        reponse.status(500).json({

            message:"Erreur serveur"

        });

    }

}

// ==========================
// Ajouter une matière
// ==========================

export function creerMatiere(requete,reponse){

    try{

        const {

            nom

        } = requete.body;

        if(!nom){

            return reponse.status(400).json({

                message:"Nom obligatoire"

            });

        }

        ajouterMatiere(
            nom
        );

        reponse.json({

            message:"Matière ajoutée avec succès"

        });

    }catch(erreur){

        console.error(erreur);

        reponse.status(500).json({

            message:"Erreur serveur"

        });

    }

}

// ==========================
// Modifier une matière
// ==========================

export function mettreAJourMatiere(requete,reponse){

    try{

        const id =
        requete.params.id;

        const {

            nom

        } = requete.body;

        modifierMatiere(
            id,
            nom
        );

        reponse.json({

            message:"Matière modifiée avec succès"

        });

    }catch(erreur){

        console.error(erreur);

        reponse.status(500).json({

            message:"Erreur serveur"

        });

    }

}

// ==========================
// Supprimer une matière
// ==========================

export function retirerMatiere(requete,reponse){

    try{

        const id =
        requete.params.id;

        supprimerMatiere(id);

        reponse.json({

            message:"Matière supprimée avec succès"

        });

    }catch(erreur){

        console.error(erreur);

        reponse.status(500).json({

            message:"Erreur serveur"

        });

    }

}
