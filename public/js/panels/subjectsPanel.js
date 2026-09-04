// public/js/panels/subjectsPanel.js
// Panneau "Gestion des matières" du tableau de bord administrateur.

import { api } from "../api.js";
import { afficherNotification, echapperHtml, confirmerAction } from "../ui.js";

// Point d'entrée du panneau : appelé quand l'admin clique sur "Matières"
export async function afficherPanneauMatieres(conteneur) {

    try {

        const matieres = await api.get("/api/subjects"); // Récupère toutes les matières
        afficherListe(conteneur, matieres);                 // Affiche la liste

    } catch (erreur) {

        afficherNotification("Impossible de charger les matières", "error");
    }
}

// Affiche le tableau des matières
function afficherListe(conteneur, matieres) {

    conteneur.innerHTML = `

        <div class="barre-outils-panneau">
            <h2>Gestion des matières</h2>
            <button id="boutonAjouterMatiere">+ Ajouter une matière</button>
        </div>

        ${matieres.length === 0 ? `
            <div class="etat-vide">Aucune matière enregistrée pour le moment.</div>
        ` : `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${matieres.map(ligneTableau).join("")}
                </tbody>
            </table>
        `}
    `;

    conteneur.querySelector("#boutonAjouterMatiere")
        .addEventListener("click", () => afficherFormulaire(conteneur));

    conteneur.querySelectorAll(".modifier-matiere").forEach(bouton => {
        bouton.addEventListener("click", () => afficherFormulaire(conteneur, trouverMatiere(matieres, bouton.dataset.id)));
    });

    conteneur.querySelectorAll(".supprimer-matiere").forEach(bouton => {
        bouton.addEventListener("click", () => gererSuppression(conteneur, bouton.dataset.id));
    });
}

// Construit une ligne de tableau pour une matière
function ligneTableau(matiere) {
    return `
        <tr>
            <td class="mono">${matiere.id}</td>
            <td>${echapperHtml(matiere.nom)}</td>
            <td>
                <div class="actions-ligne">
                    <button class="secondaire modifier-matiere" data-id="${matiere.id}">Modifier</button>
                    <button class="danger supprimer-matiere" data-id="${matiere.id}">Supprimer</button>
                </div>
            </td>
        </tr>
    `;
}

// Retrouve une matière dans la liste déjà chargée
function trouverMatiere(matieres, id) {
    return matieres.find(matiere => String(matiere.id) === String(id));
}

// Affiche le formulaire d'ajout ou de modification
function afficherFormulaire(conteneur, matiereExistante = null) {

    const estModification = Boolean(matiereExistante);

    conteneur.innerHTML = `

        <div class="barre-outils-panneau">
            <h2>${estModification ? "Modifier la matière" : "Ajouter une matière"}</h2>
            <button class="secondaire" id="boutonAnnulerMatiere">Annuler</button>
        </div>

        <form id="formulaireMatiere">

            <label for="matiereNom">Nom de la matière</label>
            <input type="text" id="matiereNom" value="${estModification ? echapperHtml(matiereExistante.nom) : ""}" required>

            <button type="submit">${estModification ? "Enregistrer" : "Ajouter"}</button>

        </form>
    `;

    conteneur.querySelector("#boutonAnnulerMatiere")
        .addEventListener("click", () => afficherPanneauMatieres(conteneur));

    conteneur.querySelector("#formulaireMatiere")
        .addEventListener("submit", (evenement) => gererEnvoi(evenement, conteneur, estModification ? matiereExistante.id : null));
}

// Envoie le formulaire au serveur (POST pour créer, PUT pour modifier)
async function gererEnvoi(evenement, conteneur, idExistant) {

    evenement.preventDefault();

    const donnees = {
        nom: document.getElementById("matiereNom").value.trim()
    };

    try {

        const resultat = idExistant
            ? await api.put(`/api/subjects/${idExistant}`, donnees)
            : await api.post("/api/subjects", donnees);

        afficherNotification(resultat.message);
        await afficherPanneauMatieres(conteneur);

    } catch (erreur) {
        afficherNotification(erreur.message, "error");
    }
}

// Supprime une matière après confirmation
async function gererSuppression(conteneur, id) {

    if (!confirmerAction("Supprimer définitivement cette matière ?")) {
        return;
    }

    try {

        const resultat = await api.delete(`/api/subjects/${id}`);
        afficherNotification(resultat.message);
        await afficherPanneauMatieres(conteneur);

    } catch (erreur) {
        afficherNotification(erreur.message, "error");
    }
}
