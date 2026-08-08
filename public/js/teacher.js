// public/js/teacher.js
// Point d'entrée du tableau de bord professeur : affiche le profil du professeur
// connecté et permet de gérer les élèves, les notes et les absences.

import { exigerRole, deconnexion } from "./auth.js";
import { api } from "./api.js";
import { afficherNotification } from "./ui.js";
import { afficherPanneauEleves } from "./panels/studentsPanel.js";
import { afficherPanneauNotes } from "./panels/gradesPanel.js";
import { afficherPanneauAbsences } from "./panels/absencesPanel.js";

// On vérifie que la personne connectée est bien un professeur, sinon redirection
const utilisateur = exigerRole("teacher");

if (utilisateur) {

    const contenu = document.getElementById("contenu"); // Zone d'affichage des panneaux

    document.getElementById("deconnexion").addEventListener("click", deconnexion); // Déconnexion

    // Association entre les boutons du menu et les panneaux à afficher
    const panneaux = {
        eleves: afficherPanneauEleves,
        notes: afficherPanneauNotes,
        absences: afficherPanneauAbsences
    };

    document.querySelectorAll(".puces-menu button[data-panel]").forEach(bouton => {
        bouton.addEventListener("click", () => panneaux[bouton.dataset.panel](contenu));
    });

    chargerProfil(); // Chargement du profil professeur au démarrage de la page
}

// Charge et affiche les informations du professeur connecté (nom + matières enseignées)
async function chargerProfil() {

    try {

        const professeur = await api.get("/api/teachers/me"); // Profil lié au compte connecté

        document.getElementById("nomProfesseur").textContent = `${professeur.prenom} ${professeur.nom}`;
        document.getElementById("nomProfesseurCarte").textContent = `${professeur.prenom} ${professeur.nom}`;

    } catch (erreur) {

        // Certains comptes professeur de démonstration n'ont pas de fiche liée : on l'indique simplement
        document.getElementById("nomProfesseur").textContent = `${utilisateur.prenom} ${utilisateur.nom}`;
        document.getElementById("nomProfesseurCarte").textContent = `${utilisateur.prenom} ${utilisateur.nom}`;
        afficherNotification("Aucune fiche professeur reliée à ce compte", "error");
    }
}
