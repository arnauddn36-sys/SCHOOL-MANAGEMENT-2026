// public/js/panels/studentsPanel.js
// Panneau "Gestion des élèves" du tableau de bord administrateur.

import { api } from "../api.js";
import { afficherNotification, echapperHtml, confirmerAction } from "../ui.js";

// Point d'entrée du panneau : appelé quand l'admin clique sur "Élèves"
export async function afficherPanneauEleves(conteneur) {

    try {

        const eleves = await api.get("/api/students"); // Récupère tous les élèves
        afficherListe(conteneur, eleves);                 // Affiche la liste

    } catch (erreur) {

        afficherNotification("Impossible de charger les élèves", "error");
    }
}

// Affiche le tableau des élèves
function afficherListe(conteneur, eleves) {

    conteneur.innerHTML = `

        <div class="barre-outils-panneau">
            <h2>Gestion des élèves</h2>
            <button id="boutonAjouterEleve">+ Ajouter un élève</button>
        </div>

        ${eleves.length === 0 ? `
            <div class="etat-vide">Aucun élève enregistré pour le moment.</div>
        ` : `
            <table>
                <thead>
                    <tr>
                        <th>Matricule</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Âge</th>
                        <th>Classe</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${eleves.map(ligneTableau).join("")}
                </tbody>
            </table>
        `}
    `;

    conteneur.querySelector("#boutonAjouterEleve")
        .addEventListener("click", () => afficherFormulaire(conteneur));

    conteneur.querySelectorAll(".modifier-eleve").forEach(bouton => {
        bouton.addEventListener("click", () => afficherFormulaire(conteneur, trouverEleve(eleves, bouton.dataset.id)));
    });

    conteneur.querySelectorAll(".supprimer-eleve").forEach(bouton => {
        bouton.addEventListener("click", () => gererSuppression(conteneur, bouton.dataset.id));
    });
}

// Construit une ligne de tableau pour un élève
function ligneTableau(eleve) {
    return `
        <tr>
            <td class="mono">${echapperHtml(eleve.matricule)}</td>
            <td>${echapperHtml(eleve.nom)}</td>
            <td>${echapperHtml(eleve.prenom)}</td>
            <td>${eleve.age}</td>
            <td>${echapperHtml(eleve.classe)}</td>
            <td>
                <div class="actions-ligne">
                    <button class="secondaire modifier-eleve" data-id="${eleve.id}">Modifier</button>
                    <button class="danger supprimer-eleve" data-id="${eleve.id}">Supprimer</button>
                </div>
            </td>
        </tr>
    `;
}

// Retrouve un élève dans la liste déjà chargée
function trouverEleve(eleves, id) {
    return eleves.find(eleve => String(eleve.id) === String(id));
}

// Affiche le formulaire d'ajout ou de modification
function afficherFormulaire(conteneur, eleveExistant = null) {

    const estModification = Boolean(eleveExistant);

    conteneur.innerHTML = `

        <div class="barre-outils-panneau">
            <h2>${estModification ? "Modifier l'élève" : "Ajouter un élève"}</h2>
            <button class="secondaire" id="boutonAnnulerEleve">Annuler</button>
        </div>

        <form id="formulaireEleve">

            <label for="eleveMatricule">Matricule</label>
            <input type="text" id="eleveMatricule" value="${estModification ? echapperHtml(eleveExistant.matricule) : ""}" required>

            <label for="eleveNom">Nom</label>
            <input type="text" id="eleveNom" value="${estModification ? echapperHtml(eleveExistant.nom) : ""}" required>

            <label for="elevePrenom">Prénom</label>
            <input type="text" id="elevePrenom" value="${estModification ? echapperHtml(eleveExistant.prenom) : ""}" required>

            <label for="eleveAge">Âge</label>
            <input type="number" id="eleveAge" min="3" max="30" value="${estModification ? eleveExistant.age : ""}" required>

            <label for="eleveClasse">Classe</label>
            <input type="text" id="eleveClasse" value="${estModification ? echapperHtml(eleveExistant.classe) : ""}" required>

            <button type="submit">${estModification ? "Enregistrer" : "Ajouter"}</button>

        </form>
    `;

    conteneur.querySelector("#boutonAnnulerEleve")
        .addEventListener("click", () => afficherPanneauEleves(conteneur));

    conteneur.querySelector("#formulaireEleve")
        .addEventListener("submit", (evenement) => gererEnvoi(evenement, conteneur, estModification ? eleveExistant.id : null));
}

// Envoie le formulaire au serveur (POST pour créer, PUT pour modifier)
async function gererEnvoi(evenement, conteneur, idExistant) {

    evenement.preventDefault();

    const donnees = {
        matricule: document.getElementById("eleveMatricule").value.trim(),
        nom: document.getElementById("eleveNom").value.trim(),
        prenom: document.getElementById("elevePrenom").value.trim(),
        age: Number(document.getElementById("eleveAge").value),
        classe: document.getElementById("eleveClasse").value.trim()
    };

    try {

        const resultat = idExistant
            ? await api.put(`/api/students/${idExistant}`, donnees)
            : await api.post("/api/students", donnees);

        afficherNotification(resultat.message);
        await afficherPanneauEleves(conteneur);

    } catch (erreur) {
        afficherNotification(erreur.message, "error");
    }
}

// Supprime un élève après confirmation
async function gererSuppression(conteneur, id) {

    if (!confirmerAction("Supprimer définitivement cet élève ?")) {
        return;
    }

    try {

        const resultat = await api.delete(`/api/students/${id}`);
        afficherNotification(resultat.message);
        await afficherPanneauEleves(conteneur);

    } catch (erreur) {
        afficherNotification(erreur.message, "error");
    }
}
