// public/js/panels/subjectsPanel.js
// Panneau de gestion des matières (admin)

import { api } from "../api.js";
import { afficherNotification, echapperHtml, confirmerAction } from "../ui.js";

export async function afficherPanneauMatieres(conteneur) {
    try {
        const matieres = await api.get("/api/subjects");
        afficherListeMatieres(conteneur, matieres);
    } catch (erreur) {
        afficherNotification("Impossible de charger les matières", "error");
    }
}

function afficherListeMatieres(conteneur, matieres) {
    conteneur.innerHTML = `
        <div class="barre-outils-panneau">
            <h2>Gestion des Matières</h2>
            <button id="boutonAjouterMatiere" class="glass-btn">+ Ajouter une matière</button>
        </div>

        ${matieres.length === 0 ? `
            <div class="etat-vide">Aucune matière enregistrée pour le moment.</div>
        ` : `
            <table class="glass-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom de la matière</th>
                        <th>Coefficient</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${matieres.map(m => `
                        <tr>
                            <td>${m.id}</td>
                            <td>${echapperHtml(m.nom)}</td>
                            <td><strong>${m.coefficient || 1}</strong></td>
                            <td>
                                <div class="actions-ligne">
                                    <button class="glass-btn secondaire modifier-matiere" data-id="${m.id}">Modifier</button>
                                    <button class="glass-btn danger supprimer-matiere" data-id="${m.id}">Supprimer</button>
                                </div>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `}
    `;

    // Écouteurs d'événements
    conteneur.querySelector("#boutonAjouterMatiere").addEventListener("click", () => {
        afficherFormulaireMatiere(conteneur);
    });

    conteneur.querySelectorAll(".modifier-matiere").forEach(btn => {
        btn.addEventListener("click", () => {
            const matiere = matieres.find(m => String(m.id) === String(btn.dataset.id));
            afficherFormulaireMatiere(conteneur, matiere);
        });
    });

    conteneur.querySelectorAll(".supprimer-matiere").forEach(btn => {
        btn.addEventListener("click", () => supprimerMatiere(conteneur, btn.dataset.id));
    });
}

function afficherFormulaireMatiere(conteneur, matiereExistante = null) {
    const estModification = Boolean(matiereExistante);

    conteneur.innerHTML = `
        <div class="barre-outils-panneau">
            <h2>${estModification ? "Modifier la matière" : "Ajouter une matière"}</h2>
            <button class="glass-btn secondaire" id="boutonAnnulerMatiere">Annuler</button>
        </div>

        <form id="formulaireMatiere" class="glass-card" style="max-width: 500px; padding: 20px;">
            <div style="margin-bottom: 15px;">
                <label for="nomMatiere" style="display: block; margin-bottom: 5px;">Nom de la matière</label>
                <input type="text" id="nomMatiere" class="glass-input" value="${estModification ? echapperHtml(matiereExistante.nom) : ""}" required style="width: 100%;">
            </div>

            <div style="margin-bottom: 20px;">
                <label for="coefMatiere" style="display: block; margin-bottom: 5px;">Coefficient</label>
                <input type="number" id="coefMatiere" class="glass-input" min="1" max="10" value="${estModification ? (matiereExistante.coefficient || 1) : 1}" required style="width: 100%;">
            </div>

            <button type="submit" class="glass-btn">${estModification ? "Enregistrer les modifications" : "Ajouter la matière"}</button>
        </form>
    `;

    conteneur.querySelector("#boutonAnnulerMatiere").addEventListener("click", () => {
        afficherPanneauMatieres(conteneur);
    });

    conteneur.querySelector("#formulaireMatiere").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const donnees = {
            nom: document.getElementById("nomMatiere").value.trim(),
            coefficient: Number(document.getElementById("coefMatiere").value) || 1
        };

        try {
            if (estModification) {
                await api.put(`/api/subjects/${matiereExistante.id}`, donnees);
                afficherNotification("Matière modifiée avec succès", "success");
            } else {
                await api.post("/api/subjects", donnees);
                afficherNotification("Matière ajoutée avec succès", "success");
            }
            afficherPanneauMatieres(conteneur);
        } catch (erreur) {
            afficherNotification(erreur.message || "Erreur lors de l'enregistrement", "error");
        }
    });
}

async function supprimerMatiere(conteneur, id) {
    if (!confirmerAction("Voulez-vous vraiment supprimer cette matière ?")) return;

    try {
        await api.delete(`/api/subjects/${id}`);
        afficherNotification("Matière supprimée avec succès", "success");
        afficherPanneauMatieres(conteneur);
    } catch (erreur) {
        afficherNotification(erreur.message || "Erreur lors de la suppression", "error");
    }
}