// public/js/panels/gradesPanel.js
// Panneau "Gestion des notes" du tableau de bord administrateur (et professeur).

import { api } from "../api.js";
import { afficherNotification, echapperHtml, confirmerAction } from "../ui.js";

// Point d'entrée du panneau : appelé quand on clique sur "Notes"
export async function afficherPanneauNotes(conteneur) {

    try {

        const notes = await api.get("/api/grades"); // Récupère toutes les notes
        afficherListe(conteneur, notes);               // Affiche la liste

    } catch (erreur) {

        afficherNotification("Impossible de charger les notes", "error");
    }
}

// Affiche le tableau des notes
function afficherListe(conteneur, notes) {

    conteneur.innerHTML = `

        <div class="barre-outils-panneau">
            <h2>Gestion des notes</h2>
            <button id="boutonAjouterNote">+ Ajouter une note</button>
        </div>

        ${notes.length === 0 ? `
            <div class="etat-vide">Aucune note enregistrée pour le moment.</div>
        ` : `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Élève</th>
                        <th>Matière</th>
                        <th>Note</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${notes.map(ligneTableau).join("")}
                </tbody>
            </table>
        `}
    `;

    conteneur.querySelector("#boutonAjouterNote")
        .addEventListener("click", () => afficherFormulaire(conteneur));

    conteneur.querySelectorAll(".supprimer-note").forEach(bouton => {
        bouton.addEventListener("click", () => gererSuppression(conteneur, bouton.dataset.id));
    });
}

// Construit une ligne de tableau pour une note
function ligneTableau(note) {
    return `
        <tr>
            <td class="mono">${note.id}</td>
            <td>${echapperHtml(note.nom)} ${echapperHtml(note.prenom)}</td>
            <td>${echapperHtml(note.matiere)}</td>
            <td class="mono">${note.note}/20</td>
            <td>
                <div class="actions-ligne">
                    <button class="danger supprimer-note" data-id="${note.id}">Supprimer</button>
                </div>
            </td>
        </tr>
    `;
}

// Affiche le formulaire d'ajout d'une note (avec listes déroulantes élèves/matières)
async function afficherFormulaire(conteneur) {

    try {

        // On charge les élèves et les matières en parallèle pour remplir les listes déroulantes
        const [eleves, matieres] = await Promise.all([
            api.get("/api/students"),
            api.get("/api/subjects")
        ]);

        conteneur.innerHTML = `

            <div class="barre-outils-panneau">
                <h2>Ajouter une note</h2>
                <button class="secondaire" id="boutonAnnulerNote">Annuler</button>
            </div>

            <form id="formulaireNote">

                <label for="noteEleve">Élève</label>
                <select id="noteEleve">
                    ${eleves.map(eleve =>
                        `<option value="${eleve.id}">${echapperHtml(eleve.nom)} ${echapperHtml(eleve.prenom)}</option>`
                    ).join("")}
                </select>

                <label for="noteMatiere">Matière</label>
                <select id="noteMatiere">
                    ${matieres.map(matiere =>
                        `<option value="${matiere.id}">${echapperHtml(matiere.nom)}</option>`
                    ).join("")}
                </select>

                <label for="noteValeur">Note (sur 20)</label>
                <input type="number" id="noteValeur" min="0" max="20" step="0.5" required>

                <button type="submit">Ajouter</button>

            </form>
        `;

        conteneur.querySelector("#boutonAnnulerNote")
            .addEventListener("click", () => afficherPanneauNotes(conteneur));

        conteneur.querySelector("#formulaireNote")
            .addEventListener("submit", (evenement) => gererEnvoi(evenement, conteneur));

    } catch (erreur) {
        afficherNotification("Impossible de charger les élèves ou les matières", "error");
    }
}

// Envoie le formulaire d'ajout au serveur
async function gererEnvoi(evenement, conteneur) {

    evenement.preventDefault();

    const donnees = {
        student_id: Number(document.getElementById("noteEleve").value),
        subject_id: Number(document.getElementById("noteMatiere").value),
        note: Number(document.getElementById("noteValeur").value)
    };

    try {

        const resultat = await api.post("/api/grades", donnees);
        afficherNotification(resultat.message);
        await afficherPanneauNotes(conteneur);

    } catch (erreur) {
        afficherNotification(erreur.message, "error");
    }
}

// Supprime une note après confirmation
async function gererSuppression(conteneur, id) {

    if (!confirmerAction("Supprimer définitivement cette note ?")) {
        return;
    }

    try {

        const resultat = await api.delete(`/api/grades/${id}`);
        afficherNotification(resultat.message);
        await afficherPanneauNotes(conteneur);

    } catch (erreur) {
        afficherNotification(erreur.message, "error");
    }
}
