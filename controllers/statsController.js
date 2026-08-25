// controllers/statsController.js
// Reçoit les requêtes HTTP liées aux statistiques et appelle le service correspondant.

import { obtenirStatistiques } from "../services/statsService.js";

// ==========================
// Récupérer les statistiques
// ==========================
export async function recupererStatistiques(requete, reponse) {
    try {
        const statistiques = await obtenirStatistiques();
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