// public/js/panels/statsPanel.js
// Panneau "Statistiques" du tableau de bord administrateur (lecture seule).

import { api } from "../api.js";
import { afficherNotification, echapperHtml } from "../ui.js";

// Point d'entrée du panneau : appelé quand l'admin clique sur "Statistiques"
export async function afficherPanneauStatistiques(conteneur) {

    try {

        const statistiques = await api.get("/api/stats"); // Récupère les statistiques calculées côté serveur

        conteneur.innerHTML = `

            <div class="barre-outils-panneau">
                <h2><i class="fa-solid fa-chart-pie"></i> Statistiques générales</h2>
            </div>

            <div class="grille-statistiques">

                <div class="carte-statistique">
                    <span class="titre-statistique">Utilisateurs</span>
                    <span class="valeur-statistique">${statistiques.utilisateurs}</span>
                </div>

                <div class="carte-statistique">
                    <span class="titre-statistique">Élèves</span>
                    <span class="valeur-statistique">${statistiques.eleves}</span>
                </div>

                <div class="carte-statistique">
                    <span class="titre-statistique">Professeurs</span>
                    <span class="valeur-statistique">${statistiques.professeurs}</span>
                </div>

                <div class="carte-statistique">
                    <span class="titre-statistique">Matières</span>
                    <span class="valeur-statistique">${statistiques.matieres}</span>
                </div>

                <div class="carte-statistique">
                    <span class="titre-statistique">Notes</span>
                    <span class="valeur-statistique">${statistiques.notes}</span>
                </div>

                <div class="carte-statistique">
                    <span class="titre-statistique">Absences</span>
                    <span class="valeur-statistique">${statistiques.absences}</span>
                </div>

                <div class="carte-statistique">
                    <span class="titre-statistique">Moyenne générale</span>
                    <span class="valeur-statistique">${statistiques.moyenneGenerale ? Number(statistiques.moyenneGenerale).toFixed(2) : "0"}/20</span>
                </div>

                <div class="carte-statistique">
                    <span class="titre-statistique">Meilleur élève</span>
                    <span class="valeur-statistique" style="font-size:1.1rem;">
                        ${statistiques.meilleurEleve
                            ? `${echapperHtml(statistiques.meilleurEleve.nom)} ${echapperHtml(statistiques.meilleurEleve.prenom)}
                               <span class="mono" style="font-size:0.9rem; color:var(--texte-attenue);">(${Number(statistiques.meilleurEleve.moyenne).toFixed(2)}/20)</span>`
                            : "Aucun"}
                    </span>
                </div>

            </div>
        `;

    } catch (erreur) {

        afficherNotification("Impossible de charger les statistiques", "error");
    }
}
