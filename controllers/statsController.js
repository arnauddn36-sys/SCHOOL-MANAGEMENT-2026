import { obtenirStatistiques } from "../services/statsService.js";

// ==========================
// Récupérer les statistiques
// ==========================

export function recupererStatistiques(requete, reponse) {

    try {

        const statistiques = obtenirStatistiques();

        reponse.json(statistiques);

    } catch (erreur) {

        console.error(
            "Erreur récupération statistiques :",
            erreur
        );

        reponse.status(500).json({

            message: "Erreur serveur"

        });

    }

}
