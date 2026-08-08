import bd from "./db/database.js";
//cette fonction est pour ajouter un étudiant
import { ajouterEleve } from "./services/studentService.js";
//cette fonction est pour supprimer un étudiant
import{supprimerEleve} from "./services/studentService.js";
//cette fonction est pour afficher un étudiant par son id
import { obtenirEleveParId } from "./services/studentService.js";
//cette fonction est pour lister tous les étudiants
import{listerEleves} from "./services/studentService.js";
//cette fonction est pour mettre à jour un étudiant par son id
import{modifierEleve} from "./services/studentService.js";

//cette fonction est pour ajouter un enseignant
import {ajouterProfesseur} from "./services/teacherService.js";
//cette fonction est pour rechercher un enseignant 
import {obtenirProfesseurParId} from "./services/teacherService.js";
//cette fonction est pour supprimer un enseignant
import {supprimerProfesseur} from "./services/teacherService.js";
//cette fonction est pour modifier un enseignant
import {modifierProfesseur} from "./services/teacherService.js";
//cette fonction est pour lister tous les enseignants
import {listerProfesseurs} from "./services/teacherService.js";

//cette fonctionnalité est pour les utilisateurs

//cette fonction est pour ajouter un utilisateur
import {ajouterUtilisateur} from "./services/userService.js";
//cette fonction est pour supprimer un utilisateur
import {supprimerUtilisateur} from "./services/userService.js";
//cette fonction est pour modifier un utilisateur
import {modifierUtilisateur} from "./services/userService.js";
//cette fonction est pour lister tous les utilisateurs
import {listerUtilisateurs} from "./services/userService.js";
//cette fonction est pour rechercher un utilisateur par son id
import {obtenirUtilisateurParId} from "./services/userService.js";

//cette fonctionnalité est pour les matières

import { ajouterMatiere } from "./services/subjectService.js";
import { listerMatieres } from "./services/subjectService.js";
import { obtenirMatiereParId } from "./services/subjectService.js";
import { modifierMatiere } from "./services/subjectService.js";
import { supprimerMatiere } from "./services/subjectService.js";

//cette fonction est pour les notes

import { ajouterNote } from "./services/gradeService.js";
import {listerNotes}  from "./services/gradeService.js";
import {supprimerNote} from "./services/gradeService.js";
import {modifierNote} from "./services/gradeService.js";
import { obtenirNoteParId } from "./services/gradeService.js";

//cette fonction est pour les statistiques

import { obtenirMoyenneGenerale } from "./services/statsService.js";
import { obtenirMeilleurEleve } from "./services/statsService.js";
import { compterAbsences } from "./services/statsService.js";

// Fonction auth
import { demander } from "./utils/ask.js";
import { connexion } from "./auth/authService.js";
import { afficherMenuPrincipal } from "./menu/mainMenu.js";
import { definirUtilisateur } from "./utils/session.js";

async function demarrerApplication() {
    console.clear();
    console.log(`

        ____________ BIENVENUE ____________

                       *A*

              ___SCHOOL-MANAGEMENT___




                ** Se connecter ** 
    `);

console.log("\n Tapez 0 pour reprendre la saisie.\n");

const nom = await demander("Nom : ");
if (nom === "0") return demarrerApplication();

const prenom = await demander("Prénom : ");
if (prenom === "0") return demarrerApplication();

const motDePasse = await demander("Mot de passe : ");
if (motDePasse === "0") return demarrerApplication();

    const utilisateur = connexion(nom, prenom, motDePasse);

    if (!utilisateur) {
        console.log(" Identifiants incorrects");
        return demarrerApplication();
    }

    definirUtilisateur(utilisateur);

    console.log(`\n Bienvenue ${utilisateur.nom} ${utilisateur.prenom}  (${utilisateur.role})\n`);

    afficherMenuPrincipal(utilisateur);
}

demarrerApplication();
