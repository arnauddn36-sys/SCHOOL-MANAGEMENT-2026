// public/js/student.js
// Point d'entrée du tableau de bord élève : affiche la fiche d'identité,
// les notes et les absences de l'élève connecté (lecture seule).

import { exigerRole, deconnexion } from "./auth.js";
import { api } from "./api.js";
import { afficherNotification, echapperHtml } from "./ui.js";

// On vérifie que la personne connectée est bien un élève, sinon redirection
const utilisateur = exigerRole("student");

if (utilisateur) {

    document.getElementById("deconnexion").addEventListener("click", deconnexion); // Déconnexion
    chargerProfil(); // Chargement des informations de l'élève au démarrage de la page
}

// Charge le profil complet de l'élève (infos + notes + absences) et remplit la page
async function chargerProfil() {

    try {

        const profil = await api.get("/api/students/me"); // Profil lié au compte connecté

        afficherIdentite(profil);          // Affiche la fiche d'identité
        afficherNotes(profil.grades);       // Affiche le tableau des notes
        afficherAbsences(profil.absences);  // Affiche le tableau des absences

    } catch (erreur) {

        afficherNotification("Aucune fiche élève reliée à ce compte", "error");
    }
}

// Remplit la fiche d'identité (nom, prénom, classe, matricule)
function afficherIdentite(profil) {

    document.getElementById("nomEleve").textContent = `${profil.prenom} ${profil.nom}`;
    document.getElementById("nomEleveCarte").textContent = `${profil.prenom} ${profil.nom}`;
    document.getElementById("infoNom").textContent = profil.nom;
    document.getElementById("infoPrenom").textContent = profil.prenom;
    document.getElementById("infoClasse").textContent = profil.classe;
    document.getElementById("infoMatricule").textContent = profil.matricule;
}

// Construit le tableau des notes de l'élève
function afficherNotes(notes) {

    const corpsTableau = document.getElementById("corpsNotes"); // Corps du tableau des notes

    if (notes.length === 0) {
        corpsTableau.innerHTML = `<tr><td colspan="2">Aucune note pour le moment.</td></tr>`;
        return;
    }

    corpsTableau.innerHTML = notes.map(note => `
        <tr>
            <td>${echapperHtml(note.matiere)}</td>
            <td class="mono">${note.note}/20</td>
        </tr>
    `).join("");
}

// Construit le tableau des absences de l'élève
function afficherAbsences(absences) {

    const corpsTableau = document.getElementById("corpsAbsences"); // Corps du tableau des absences

    if (absences.length === 0) {
        corpsTableau.innerHTML = `<tr><td colspan="2">Aucune absence enregistrée.</td></tr>`;
        return;
    }

    corpsTableau.innerHTML = absences.map(absence => `
        <tr>
            <td class="mono">${absence.date}</td>
            <td><span class="badge ${absence.status === "Justifié" ? "ok" : ""}">${echapperHtml(absence.status)}</span></td>
        </tr>
    `).join("");
}
