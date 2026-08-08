// IMPORTS

// fonction utilitaire pour poser des questions dans le terminal
import { demander } from "../utils/ask.js";

// services étudiants (CRUD étudiants)
import {
    ajouterEleve, listerEleves, obtenirEleveParId, modifierEleve, supprimerEleve
} from "../services/studentService.js";

// services enseignants (CRUD enseignants)
import {
    ajouterProfesseur, listerProfesseurs, obtenirProfesseurParId, modifierProfesseur, supprimerProfesseur
} from "../services/teacherService.js";

// services matières (CRUD matières)
import {
    ajouterMatiere, listerMatieres, obtenirMatiereParId, modifierMatiere, supprimerMatiere
} from "../services/subjectService.js";

// services notes (CRUD notes)
import {
    ajouterNote, listerNotes, obtenirNoteParId, modifierNote, supprimerNote
} from "../services/gradeService.js";

// services statistiques (calculs globaux)
import {
    obtenirMoyenneGenerale, obtenirMeilleurEleve, compterAbsences
} from "../services/statsService.js";

import { ajouterUtilisateur, listerUtilisateurs, obtenirUtilisateurParId, modifierUtilisateur, supprimerUtilisateur } 
from "../services/userService.js";

/// MENU PRINCIPAL
export async function afficherMenuPrincipal(utilisateur) {
    console.clear();

    console.log(`
SCHOOL MANAGEMENT

Utilisateur: ${utilisateur.nom} ${utilisateur.prenom} (${utilisateur.role})
`);

    const options = [];
    options.push("1 - Étudiants");
    if (utilisateur.role === "admin") {
    options.push("2 - Gestion des utilisateurs");
    }
    options.push("3 - Matières");
    options.push("4 - Notes");
    options.push("5 - Absences");
    options.push("6 - Statistiques");

    options.push("0 - Quitter");

    console.log(options.join("\n"));

    const choix = await demander("\nChoix : ");
    await traiterMenuPrincipal(choix, utilisateur);
}

// MENU ADMIN

async function afficherMenuAdmin(utilisateur) {
    console.clear();

    console.log(`
===== GESTION DES UTILISATEURS =====

1 - Ajouter un utilisateur
2 - Modifier un utilisateur
3 - Lister les utilisateurs
4 - Supprimer un utilisateur
0 - Retour
`);

    const choix = await demander("Choix : ");

    switch (choix.trim()) {
       case "1": {
    const nom = await demander("Nom : ");
    const prenom = await demander("Prénom : ");
    const motDePasse = await demander("Mot de passe : ");
    const role = await demander("Rôle (admin/teacher/student) : ");

    ajouterUtilisateur(nom, prenom, motDePasse, role);
    break;
}

       case "2": {
    const id = await demander("ID de l'utilisateur : ");
    const nom = await demander("Nouveau nom : ");
    const prenom = await demander("Nouveau prénom : ");
    const motDePasse = await demander("Nouveau mot de passe : ");
    const role = await demander("Nouveau rôle : ");

    modifierUtilisateur(
        Number(id),
        nom,
        prenom,
        motDePasse,
        role
    );
    break;
}

        case "3":
            listerUtilisateurs();
            break;

        case "4": {
    const id = await demander("ID de l'utilisateur à supprimer : ");
    supprimerUtilisateur(Number(id));
    break;
}
        case "0":
            return afficherMenuPrincipal(utilisateur);

        default:
            console.log("Choix invalide");
    }

    await demander("\nAppuyez sur Entrée pour continuer...");
    return afficherMenuAdmin(utilisateur);
}



// MENU ÉTUDIANTS

async function afficherMenuEtudiants(utilisateur) {
    console.log(`
ÉTUDIANTS
1 - Ajouter
2 - Lister
3 - Voir par ID
4 - Modifier
5 - Supprimer
0 - Retour
    `);

    const choix = await demander("Choix : ");
    await traiterMenuEtudiants(choix, utilisateur);
}

async function traiterMenuEtudiants(choix, utilisateur){
    if (
        (utilisateur.role === "teacher" || utilisateur.role === "student") &&
        ["1", "4", "5"].includes(choix)
    ) {
        console.log("Accès refusé (lecture seule)");
        return afficherMenuEtudiants(utilisateur);
    }

    switch (choix.trim()) {
        case "1": {
            const matricule = await demander("Matricule: ");
            const nom = await demander("Nom: ");
            const prenom = await demander("Prénom: ");
            const age = await demander("Âge: ");
            const classe = await demander("Classe: ");
            ajouterEleve(matricule, nom, prenom, Number(age), classe);
            break;
        }
        case "2":
            listerEleves();
            break;
        case "3": {
            const id = await demander("ID: ");
            obtenirEleveParId(Number(id));
            break;
        }
        case "4": {
            const id = await demander("ID: ");
            const matricule = await demander("Matricule: ");
            const nom = await demander("Nom: ");
            const prenom = await demander("Prénom: ");
            const age = await demander("Âge: ");
            const classe = await demander("Classe: ");
            modifierEleve(Number(id), matricule, nom, prenom, Number(age), classe);
            break;
        }
        case "5": {
            const id = await demander("ID: ");
            supprimerEleve(Number(id));
            break;
        }
        case "0":
            return afficherMenuPrincipal(utilisateur);
        default:
            console.log("Choix invalide");
    }

    return afficherMenuEtudiants(utilisateur);
}


// MENU ENSEIGNANTS

async function afficherMenuEnseignants(utilisateur) {
    console.log(`
TEACHER
1 - Ajouter
2 - Lister
3 - Voir par ID
4 - Modifier
5 - Supprimer
0 - Retour
`);

    const choix = await demander("Choix : ");
    return await traiterMenuEnseignants(choix, utilisateur);
}

async function traiterMenuEnseignants(choix, utilisateur) {
    switch (choix.trim()) {
        case "1": {
            const nom = await demander("Nom: ");
            const matiere = await demander("Matière: ");
            ajouterProfesseur(nom, matiere);
            break;
        }
        case "2":
            listerProfesseurs();
            break;
        case "3": {
            const id = await demander("ID: ");
            obtenirProfesseurParId(Number(id));
            break;
        }
        case "4": {
            const id = await demander("ID: ");
            const nom = await demander("Nom: ");
            const matiere = await demander("Matière: ");
            modifierProfesseur(Number(id), nom, matiere);
            break;
        }
        case "5": {
            const id = await demander("ID: ");
            supprimerProfesseur(Number(id));
            break;
        }
        case "0":
            return afficherMenuPrincipal(utilisateur);
        default:
            console.log("Choix invalide");
    }

    return afficherMenuEnseignants(utilisateur);
}


// MENU MATIÈRES

async function afficherMenuMatieres(utilisateur) {
    console.log(`
MATIÈRES
1 - Ajouter
2 - Lister
3 - Voir par ID
4 - Modifier
5 - Supprimer
0 - Retour
`);

    const choix = await demander("Choix : ");
    await traiterMenuMatieres(choix, utilisateur);
}

async function traiterMenuMatieres(choix, utilisateur) {
    switch (choix.trim()) {
        case "1": {
            const nom = await demander("Nom matière: ");
            const idEnseignant = await demander("ID enseignant: ");
            ajouterMatiere(nom, Number(idEnseignant));
            break;
        }
        case "2":
            listerMatieres();
            break;
        case "3": {
            const id = await demander("ID: ");
            obtenirMatiereParId(Number(id));
            break;
        }
        case "4": {
            const id = await demander("ID: ");
            const nom = await demander("Nom: ");
            const idEnseignant = await demander("ID enseignant: ");
            modifierMatiere(Number(id), nom, Number(idEnseignant));
            break;
        }
        case "5": {
            const id = await demander("ID: ");
            supprimerMatiere(Number(id));
            break;
        }
        case "0":
            return afficherMenuPrincipal(utilisateur);
        default:
            console.log("Choix invalide");
    }

    return afficherMenuMatieres(utilisateur);
}


// MENU NOTES

async function afficherMenuNotes(utilisateur) {
    console.log(`
NOTES
1 - Ajouter
2 - Lister
3 - Voir par ID
4 - Modifier
5 - Supprimer
0 - Retour
`);

    const choix = await demander("Choix : ");
    await traiterMenuNotes(choix, utilisateur);
}

async function traiterMenuNotes(choix, utilisateur) {
    switch (choix.trim()) {
        case "1": {
            const idEtudiant = await demander("ID étudiant: ");
            const idMatiere = await demander("ID matière: ");
            const note = await demander("Note: ");
            ajouterNote(Number(idEtudiant), Number(idMatiere), Number(note));
            break;
        }
        case "2":
            listerNotes();
            break;
        case "3": {
            const id = await demander("ID note: ");
            obtenirNoteParId(Number(id));
            break;
        }
        case "4": {
            const id = await demander("ID: ");
            const idEtudiant = await demander("ID étudiant: ");
            const idMatiere = await demander("ID matière: ");
            const note = await demander("Note: ");
            modifierNote(Number(id), Number(idEtudiant), Number(idMatiere), Number(note));
            break;
        }
        case "5": {
            const id = await demander("ID: ");
            supprimerNote(Number(id));
            break;
        }
        case "0":
            return afficherMenuPrincipal(utilisateur);
        default:
            console.log("Choix invalide");
    }

    return afficherMenuNotes(utilisateur);
}


// MENU ABSENCES

async function afficherMenuAbsences(utilisateur) {
    console.log(`
ABSENCES
1 - Ajouter une absence
2 - Lister les absences
3 - Modifier une absence
4 - Supprimer une absence
0 - Retour
    `);

    const choix = await demander("Choix : ");
    await traiterMenuAbsences(choix, utilisateur);
}

async function traiterMenuAbsences(choix, utilisateur) {
    switch (choix.trim()) {
        case "1": {
            const idEtudiant = await demander("ID étudiant: ");
            const date = await demander("Date (JJ/MM/AAAA): ");
            const motif = await demander("Motif: ");
            console.log(`\nDemande d'ajout enregistrée pour l'étudiant ID ${idEtudiant}`);
            break;
        }
        case "2":
            console.log("\nAffichage de la liste des absences...");
            break;
        case "3": {
            const id = await demander("ID absence à modifier: ");
            const idEtudiant = await demander("Nouvel ID étudiant: ");
            const date = await demander("Nouvelle Date: ");
            const motif = await demander("Nouveau Motif: ");
            console.log(`\nModification de l'absence ID ${id} demandée`);
            break;
        }
        case "4": {
            const id = await demander("ID absence à supprimer: ");
            console.log(`\nSuppression de l'absence ID ${id} demandée`);
            break;
        }
        case "0":
            return afficherMenuPrincipal(utilisateur);
        default:
            console.log("Choix invalide");
    }

    return afficherMenuAbsences(utilisateur);
}


// MENU STATISTIQUES

async function afficherMenuStatistiques(utilisateur) {
    console.log(`
STATISTIQUES
1 - Moyenne générale
2 - Meilleur élève
3 - Total absences
0 - Retour
`);

    const choix = await demander("Choix : ");
    await traiterMenuStatistiques(choix, utilisateur);
}

async function traiterMenuStatistiques(choix, utilisateur) {
    switch (choix.trim()) {
        case "1":
            console.log(obtenirMoyenneGenerale());
            break;
        case "2":
            console.log(obtenirMeilleurEleve());
            break;
        case "3":
            console.log(compterAbsences());
            break;
        case "0":
            return afficherMenuPrincipal(utilisateur);
        default:
            console.log("Choix invalide");
    }

    return afficherMenuStatistiques(utilisateur);
}


// ROUTEUR PRINCIPAL

async function traiterMenuPrincipal(choix, utilisateur) {
    const role = utilisateur.role;

    switch (choix.trim()) {
        case "1":
            return await afficherMenuEtudiants(utilisateur);
        case "2":
    if (role !== "admin") {
        console.log("Accès refusé");
        return afficherMenuPrincipal(utilisateur);
    }
    return await afficherMenuAdmin(utilisateur);
        case "3":
            if (!["admin", "teacher"].includes(role)) {
                console.log("Accès refusé");
                return afficherMenuPrincipal(utilisateur);
            }
            return await afficherMenuMatieres(utilisateur);
        case "4":
            if (!["admin", "teacher"].includes(role)) {
                console.log("Accès refusé");
                return afficherMenuPrincipal(utilisateur);
            }
            return await afficherMenuNotes(utilisateur);
        case "5":
            if (!["admin", "teacher"].includes(role)) {
                console.log("Accès refusé");
                return afficherMenuPrincipal(utilisateur);
            }
            return await afficherMenuAbsences(utilisateur);
        case "6":
            if (role !== "admin") {
                console.log("Accès refusé");
                return afficherMenuPrincipal(utilisateur);
            }
            return await afficherMenuStatistiques(utilisateur);
        case "0":
            console.log("Déconnexion...");
            return process.exit();
        default:
            console.log("Choix invalide");
            return afficherMenuPrincipal(utilisateur);
    }
}
