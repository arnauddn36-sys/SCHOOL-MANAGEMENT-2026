// public/js/panels/teachersPanel.js
// Panneau "Gestion des professeurs" du tableau de bord administrateur.

import { api } from "../api.js";
import { afficherNotification, echapperHtml, confirmerAction } from "../ui.js";

// Point d'entrée du panneau : appelé quand l'admin clique sur "Professeurs"
export async function afficherPanneauProfesseurs(conteneur) {

    try {

        const professeurs = await api.get("/api/teachers"); // Récupère tous les professeurs
        afficherListe(conteneur, professeurs);                 // Affiche la liste

    } catch (erreur) {

        afficherNotification("Impossible de charger les professeurs", "error");
    }
}

// Affiche le tableau des professeurs
function afficherListe(conteneur, professeurs) {

    conteneur.innerHTML = `

        <div class="barre-outils-panneau">
            <h2>Gestion des professeurs</h2>
            <button id="boutonAjouterProfesseur">+ Ajouter un professeur</button>
        </div>

        ${professeurs.length === 0 ? `
            <div class="etat-vide">Aucun professeur enregistré pour le moment.</div>
        ` : `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Matières</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${professeurs.map(ligneTableau).join("")}
                </tbody>
            </table>
        `}
    `;

    conteneur.querySelector("#boutonAjouterProfesseur")
        .addEventListener("click", () => afficherFormulaire(conteneur));

    conteneur.querySelectorAll(".attribuer-matiere").forEach(bouton => {
        bouton.addEventListener("click", () => afficherFormulaireAttribution(conteneur, bouton.dataset.id));
    });

    conteneur.querySelectorAll(".supprimer-professeur").forEach(bouton => {
        bouton.addEventListener("click", () => gererSuppression(conteneur, bouton.dataset.id));
    });
}

// Construit une ligne de tableau pour un professeur
function ligneTableau(professeur) {
    return `
        <tr>
            <td class="mono">${professeur.id}</td>
            <td>${echapperHtml(professeur.nom)}</td>
            <td>${echapperHtml(professeur.prenom)}</td>
            <td>${professeur.matieres.length > 0 ? professeur.matieres.map(echapperHtml).join(", ") : "Aucune"}</td>
            <td>
                <div class="actions-ligne">
                    <button class="secondaire attribuer-matiere" data-id="${professeur.id}">Attribuer matière</button>
                    <button class="danger supprimer-professeur" data-id="${professeur.id}">Supprimer</button>
                </div>
            </td>
        </tr>
    `;
}

// Affiche le formulaire d'ajout d'un professeur
function afficherFormulaire(conteneur) {

    conteneur.innerHTML = `

        <div class="barre-outils-panneau">
            <h2>Ajouter un professeur</h2>
            <button class="secondaire" id="boutonAnnulerProfesseur">Annuler</button>
        </div>

        <form id="formulaireProfesseur">

            <label for="professeurNom">Nom</label>
            <input type="text" id="professeurNom" required>

            <label for="professeurPrenom">Prénom</label>
            <input type="text" id="professeurPrenom" required>

            <button type="submit">Ajouter</button>

        </form>
    `;

    conteneur.querySelector("#boutonAnnulerProfesseur")
        .addEventListener("click", () => afficherPanneauProfesseurs(conteneur));

    conteneur.querySelector("#formulaireProfesseur")
        .addEventListener("submit", (evenement) => gererEnvoi(evenement, conteneur));
}

// Envoie le formulaire d'ajout au serveur
async function gererEnvoi(evenement, conteneur) {

    evenement.preventDefault();

    const donnees = {
        nom: document.getElementById("professeurNom").value.trim(),
        prenom: document.getElementById("professeurPrenom").value.trim()
    };

    try {

        const resultat = await api.post("/api/teachers", donnees);
        afficherNotification(resultat.message);
        await afficherPanneauProfesseurs(conteneur);

    } catch (erreur) {
        afficherNotification(erreur.message, "error");
    }
}

// Affiche le formulaire d'attribution d'une matière à un professeur
async function afficherFormulaireAttribution(conteneur, idProfesseur) {

    try {

        const matieres = await api.get("/api/subjects"); // Liste des matières disponibles

        conteneur.innerHTML = `

            <div class="barre-outils-panneau">
                <h2>Attribuer une matière</h2>
                <button class="secondaire" id="boutonAnnulerAttribution">Annuler</button>
            </div>

            <form id="formulaireAttribution">

                <label for="matiereAttribuee">Matière</label>
                <select id="matiereAttribuee">
                    ${matieres.map(matiere => `<option value="${matiere.id}">${echapperHtml(matiere.nom)}</option>`).join("")}
                </select>

                <button type="submit">Attribuer</button>

            </form>
        `;

        conteneur.querySelector("#boutonAnnulerAttribution")
            .addEventListener("click", () => afficherPanneauProfesseurs(conteneur));

        conteneur.querySelector("#formulaireAttribution")
            .addEventListener("submit", (evenement) => gererAttribution(evenement, conteneur, idProfesseur));

    } catch (erreur) {
        afficherNotification("Impossible de charger les matières", "error");
    }
}

// Envoie l'attribution de matière au serveur
async function gererAttribution(evenement, conteneur, idProfesseur) {

    evenement.preventDefault();

    const idMatiere = document.getElementById("matiereAttribuee").value;

    try {

        const resultat = await api.put("/api/teachers/assign-subject", {
            teacherId: Number(idProfesseur),
            subjectId: Number(idMatiere)
        });

        afficherNotification(resultat.message);
        await afficherPanneauProfesseurs(conteneur);

    } catch (erreur) {
        afficherNotification(erreur.message, "error");
    }
}

// Supprime un professeur après confirmation
async function gererSuppression(conteneur, id) {

    if (!confirmerAction("Supprimer définitivement ce professeur ?")) {
        return;
    }

    try {

        const resultat = await api.delete(`/api/teachers/${id}`);
        afficherNotification(resultat.message);
        await afficherPanneauProfesseurs(conteneur);

    } catch (erreur) {
        afficherNotification(erreur.message, "error");
    }
}
