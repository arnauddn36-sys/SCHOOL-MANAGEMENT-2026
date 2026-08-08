// public/js/panels/absencesPanel.js
// Panneau "Gestion des absences" du tableau de bord administrateur (et professeur).

import { api } from "../api.js";
import { afficherNotification, echapperHtml, confirmerAction } from "../ui.js";

// Point d'entrée du panneau : appelé quand on clique sur "Absences"
export async function afficherPanneauAbsences(conteneur) {

    try {

        const absences = await api.get("/api/absences"); // Récupère toutes les absences
        afficherListe(conteneur, absences);                 // Affiche la liste

    } catch (erreur) {

        afficherNotification(`Impossible de charger les absences : ${erreur.message || erreur}`, "error");
    }
}

// Affiche le tableau des absences
function afficherListe(conteneur, absences) {

    conteneur.innerHTML = `

        <div class="barre-outils-panneau">
            <h2>Gestion des absences</h2>
            <button id="boutonAjouterAbsence">+ Ajouter une absence</button>
        </div>

        ${absences.length === 0 ? `
            <div class="etat-vide">Aucune absence enregistrée pour le moment.</div>
        ` : `
            <table>
                <thead>
                    <tr>
                        <th>Élève</th>
                        <th>Date</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${absences.map(ligneTableau).join("")}
                </tbody>
            </table>
        `}
    `;

    conteneur.querySelector("#boutonAjouterAbsence")
        .addEventListener("click", () => afficherFormulaire(conteneur));

    conteneur.querySelectorAll(".supprimer-absence").forEach(bouton => {
        bouton.addEventListener("click", () => gererSuppression(conteneur, bouton.dataset.id));
    });
}

// Construit une ligne de tableau pour une absence
function ligneTableau(absence) {

    const estJustifiee = absence.status === "Justifié"; // Détermine la couleur du badge

    return `
        <tr>
            <td>${echapperHtml(absence.nom)} ${echapperHtml(absence.prenom)}</td>
            <td class="mono">${absence.date}</td>
            <td><span class="badge ${estJustifiee ? "ok" : ""}">${echapperHtml(absence.status)}</span></td>
            <td>
                <div class="actions-ligne">
                    <button class="danger supprimer-absence" data-id="${absence.id}">Supprimer</button>
                </div>
            </td>
        </tr>
    `;
}

// Affiche le formulaire d'ajout d'une absence
async function afficherFormulaire(conteneur) {

    try {

        const eleves = await api.get("/api/students"); // Liste des élèves pour le menu déroulant

        conteneur.innerHTML = `

            <div class="barre-outils-panneau">
                <h2>Ajouter une absence</h2>
                <button class="secondaire" id="boutonAnnulerAbsence">Annuler</button>
            </div>

            <form id="formulaireAbsence">

                <label for="absenceEleve">Élève</label>
                <select id="absenceEleve">
                    ${eleves.map(eleve =>
                        `<option value="${eleve.id}">${echapperHtml(eleve.nom)} ${echapperHtml(eleve.prenom)}</option>`
                    ).join("")}
                </select>

                <label for="absenceDate">Date</label>
                <input type="date" id="absenceDate" required>

                <label for="absenceStatut">Statut</label>
                <select id="absenceStatut">
                    <option value="Justifié">Justifié</option>
                    <option value="Non-justifié">Non-justifié</option>
                </select>

                <button type="submit">Ajouter</button>

            </form>
        `;

        conteneur.querySelector("#boutonAnnulerAbsence")
            .addEventListener("click", () => afficherPanneauAbsences(conteneur));

        conteneur.querySelector("#formulaireAbsence")
            .addEventListener("submit", (evenement) => gererEnvoi(evenement, conteneur));

    } catch (erreur) {
        afficherNotification("Impossible de charger les élèves", "error");
    }
}

// Envoie le formulaire d'ajout au serveur
async function gererEnvoi(evenement, conteneur) {

    evenement.preventDefault();

    const donnees = {
        student_id: Number(document.getElementById("absenceEleve").value),
        date: document.getElementById("absenceDate").value,
        status: document.getElementById("absenceStatut").value
    };

    try {

        const resultat = await api.post("/api/absences", donnees);
        afficherNotification(resultat.message);
        await afficherPanneauAbsences(conteneur);

    } catch (erreur) {
        afficherNotification(erreur.message, "error");
    }
}

// Supprime une absence après confirmation
async function gererSuppression(conteneur, id) {

    if (!confirmerAction("Supprimer définitivement cette absence ?")) {
        return;
    }

    try {

        const resultat = await api.delete(`/api/absences/${id}`);
        afficherNotification(resultat.message);
        await afficherPanneauAbsences(conteneur);

    } catch (erreur) {
        afficherNotification(erreur.message, "error");
    }
}
