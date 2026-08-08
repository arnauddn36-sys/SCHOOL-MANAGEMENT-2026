// public/js/panels/usersPanel.js
// Panneau "Gestion des utilisateurs" du tableau de bord administrateur.

import { api } from "../api.js";
import { afficherNotification, echapperHtml, confirmerAction } from "../ui.js";

// Point d'entrée du panneau : appelé quand l'admin clique sur "Utilisateurs"
export async function afficherPanneauUtilisateurs(conteneur) {

    try {

        const utilisateurs = await api.get("/api/users"); // Récupère tous les comptes
        afficherListe(conteneur, utilisateurs);              // Affiche la liste

    } catch (erreur) {

        afficherNotification("Erreur lors du chargement des utilisateurs : " + (erreur.message || erreur), "error");
    }
}

// Affiche le tableau des utilisateurs
function afficherListe(conteneur, utilisateurs) {

    conteneur.innerHTML = `

        <div class="barre-outils-panneau">
            <h2>Gestion des utilisateurs</h2>
            <button id="boutonAjouterUtilisateur">+ Ajouter un utilisateur</button>
        </div>

        ${utilisateurs.length === 0 ? `
            <div class="etat-vide">Aucun utilisateur enregistré pour le moment.</div>
        ` : `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Rôle</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${utilisateurs.map(ligneTableau).join("")}
                </tbody>
            </table>
        `}
    `;

    // Bouton "Ajouter" -> affiche le formulaire de création
    conteneur.querySelector("#boutonAjouterUtilisateur")
        .addEventListener("click", () => afficherFormulaire(conteneur));

    // Boutons "Modifier" de chaque ligne
    conteneur.querySelectorAll(".modifier-utilisateur").forEach(bouton => {
        bouton.addEventListener("click", () => afficherFormulaire(conteneur, trouverUtilisateur(utilisateurs, bouton.dataset.id)));
    });

    // Boutons "Supprimer" de chaque ligne
    conteneur.querySelectorAll(".supprimer-utilisateur").forEach(bouton => {
        bouton.addEventListener("click", () => gererSuppression(conteneur, bouton.dataset.id));
    });
}

// Construit une ligne de tableau pour un utilisateur
function ligneTableau(utilisateur) {
    return `
        <tr>
            <td class="mono">${utilisateur.id}</td>
            <td>${echapperHtml(utilisateur.nom)}</td>
            <td>${echapperHtml(utilisateur.prenom)}</td>
            <td><span class="badge ok">${libelleRole(utilisateur.role)}</span></td>
            <td>
                <div class="actions-ligne">
                    <button class="secondaire modifier-utilisateur" data-id="${utilisateur.id}">Modifier</button>
                    <button class="danger supprimer-utilisateur" data-id="${utilisateur.id}">Supprimer</button>
                </div>
            </td>
        </tr>
    `;
}

// Traduit le rôle technique en libellé lisible
function libelleRole(role) {
    if (role === "admin") return "Administrateur";
    if (role === "teacher") return "Professeur";
    return "Élève";
}

// Retrouve un utilisateur dans la liste déjà chargée (évite un appel réseau supplémentaire)
function trouverUtilisateur(utilisateurs, id) {
    return utilisateurs.find(utilisateur => String(utilisateur.id) === String(id));
}

// Affiche le formulaire d'ajout (utilisateurExistant absent) ou de modification (utilisateurExistant fourni)
function afficherFormulaire(conteneur, utilisateurExistant = null) {

    const estModification = Boolean(utilisateurExistant); // true si on modifie un utilisateur existant

    conteneur.innerHTML = `

        <div class="barre-outils-panneau">
            <h2>${estModification ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</h2>
            <button class="secondaire" id="boutonAnnulerUtilisateur">Annuler</button>
        </div>

        <form id="formulaireUtilisateur">

            <label for="utilisateurNom">Nom</label>
            <input type="text" id="utilisateurNom" value="${estModification ? echapperHtml(utilisateurExistant.nom) : ""}" required>

            <label for="utilisateurPrenom">Prénom</label>
            <input type="text" id="utilisateurPrenom" value="${estModification ? echapperHtml(utilisateurExistant.prenom) : ""}" required>

            <label for="utilisateurMotDePasse">Mot de passe</label>
            <input type="text" id="utilisateurMotDePasse" value="${estModification ? echapperHtml(utilisateurExistant.password) : ""}" required>

            <label for="utilisateurRole">Rôle</label>
            <select id="utilisateurRole">
                <option value="admin"   ${estModification && utilisateurExistant.role === "admin"   ? "selected" : ""}>Administrateur</option>
                <option value="teacher" ${estModification && utilisateurExistant.role === "teacher" ? "selected" : ""}>Professeur</option>
                <option value="student" ${estModification && utilisateurExistant.role === "student" ? "selected" : ""}>Élève</option>
            </select>

            <button type="submit">${estModification ? "Enregistrer" : "Ajouter"}</button>

        </form>
    `;

    // Retour à la liste sans enregistrer
    conteneur.querySelector("#boutonAnnulerUtilisateur")
        .addEventListener("click", () => afficherPanneauUtilisateurs(conteneur));

    // Soumission du formulaire (création ou modification selon le contexte)
    conteneur.querySelector("#formulaireUtilisateur")
        .addEventListener("submit", (evenement) => gererEnvoi(evenement, conteneur, estModification ? utilisateurExistant.id : null));
}

// Envoie le formulaire au serveur (POST pour créer, PUT pour modifier)
async function gererEnvoi(evenement, conteneur, idExistant) {

    evenement.preventDefault(); // On empêche le rechargement de la page

    const donnees = {
        nom: document.getElementById("utilisateurNom").value.trim(),
        prenom: document.getElementById("utilisateurPrenom").value.trim(),
        password: document.getElementById("utilisateurMotDePasse").value,
        role: document.getElementById("utilisateurRole").value
    };

    try {

        const resultat = idExistant
            ? await api.put(`/api/users/${idExistant}`, donnees)  // Modification
            : await api.post("/api/users", donnees);                // Création

        afficherNotification(resultat.message); // Message de succès renvoyé par le serveur
        await afficherPanneauUtilisateurs(conteneur); // On revient à la liste actualisée

    } catch (erreur) {
        afficherNotification(erreur.message, "error"); // Ex: mot de passe déjà utilisé
    }
}

// Supprime un utilisateur après confirmation
async function gererSuppression(conteneur, id) {

    if (!confirmerAction("Supprimer définitivement cet utilisateur ?")) {
        return; // L'admin a annulé
    }

    try {

        const resultat = await api.delete(`/api/users/${id}`);
        afficherNotification(resultat.message);
        await afficherPanneauUtilisateurs(conteneur); // Rafraîchit la liste

    } catch (erreur) {
        afficherNotification(erreur.message, "error"); // Ex: dernier administrateur protégé
    }
}
