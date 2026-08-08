// public/js/admin.js
// Point d'entrée du tableau de bord administrateur : protège la page, affiche le
// nom de l'utilisateur, gère la déconnexion et bascule entre les différents panneaux.

import { exigerRole, deconnexion } from "./auth.js";
import { afficherPanneauUtilisateurs } from "./panels/usersPanel.js";
import { afficherPanneauEleves } from "./panels/studentsPanel.js";
import { afficherPanneauProfesseurs } from "./panels/teachersPanel.js";
import { afficherPanneauMatieres } from "./panels/subjectsPanel.js";
import { afficherPanneauNotes } from "./panels/gradesPanel.js";
import { afficherPanneauAbsences } from "./panels/absencesPanel.js";
import { afficherPanneauStatistiques } from "./panels/statsPanel.js";

// On vérifie que la personne connectée est bien un administrateur, sinon redirection
const utilisateur = exigerRole("admin");

if (utilisateur) {

    // Zone principale où chaque panneau est injecté
    const contenu = document.getElementById("contenu");

    // Affiche le nom de l'administrateur connecté dans le header
    document.getElementById("nomAdmin").textContent = `${utilisateur.prenom} ${utilisateur.nom}`;

    // Association entre l'identifiant d'un bouton de menu et la fonction qui l'affiche
    const panneaux = {
        utilisateurs: afficherPanneauUtilisateurs,
        eleves: afficherPanneauEleves,
        professeurs: afficherPanneauProfesseurs,
        matieres: afficherPanneauMatieres,
        notes: afficherPanneauNotes,
        absences: afficherPanneauAbsences,
        statistiques: afficherPanneauStatistiques
    };

    // Ouvre un panneau donné et met à jour le bouton actif dans le menu
    function ouvrirPanneau(nomPanneau) {

        // On retire la classe "actif" de tous les boutons du menu
        document.querySelectorAll(".menu-admin button").forEach(bouton => {
            bouton.classList.remove("actif");
        });

        // On ajoute la classe "actif" uniquement au bouton cliqué
        document.querySelector(`.menu-admin button[data-panel="${nomPanneau}"]`)
            .classList.add("actif");

        panneaux[nomPanneau](contenu); // On affiche le panneau correspondant
    }

    // On relie chaque bouton du menu à l'ouverture de son panneau
    document.querySelectorAll(".menu-admin button[data-panel]").forEach(bouton => {
        bouton.addEventListener("click", () => ouvrirPanneau(bouton.dataset.panel));
    });

    // Bouton de déconnexion dans le header
    document.getElementById("deconnexion").addEventListener("click", deconnexion);

    // Par défaut, on ouvre les statistiques à l'arrivée sur le tableau de bord
    ouvrirPanneau("statistiques");
}
