// public/js/student.js
// Point d'entrée du tableau de bord élève : affiche la fiche d'identité,
// les indicateurs clés, le bulletin (par trimestre), les notes et les absences
// de l'élève connecté (lecture seule).

import { exigerRole, deconnexion } from "./auth.js";
import { api } from "./api.js";
import { afficherNotification, echapperHtml } from "./ui.js";

// On vérifie que la personne connectée est bien un élève, sinon redirection
const utilisateur = exigerRole("student");

// Trimestre actuellement sélectionné dans les onglets du bulletin
let periodeActuelle = "Trimestre 1";

if (utilisateur) {
  document.getElementById("deconnexion").addEventListener("click", deconnexion); // Déconnexion

  // Relie chaque onglet de trimestre à son changement
  document.querySelectorAll(".onglet-periode").forEach((onglet) => {
    onglet.addEventListener("click", () =>
      changerPeriode(onglet.dataset.periode),
    );
  });

  chargerProfil(); // Fiche d'identité + notes en direct + absences
  chargerBulletin(periodeActuelle); // Bulletin du trimestre par défaut
}

// Charge le profil complet de l'élève (infos + notes + absences) et remplit la page
async function chargerProfil() {
  try {
    const profil = await api.get("/api/students/me"); // Profil lié au compte connecté

    afficherIdentite(profil); // Affiche la fiche d'identité + indicateurs clés
    afficherNotes(profil.grades); // Affiche le tableau des notes en direct
    afficherAbsences(profil.absences); // Affiche le tableau des absences + leur total
  } catch (erreur) {
    afficherNotification("Aucune fiche élève reliée à ce compte", "error");
  }
}

// Remplit la fiche d'identité (nom, prénom, classe, matricule) + les indicateurs clés associés
function afficherIdentite(profil) {
  const matriculeVal =
    profil.matricule ||
    profil.numero_matricule ||
    profil.matricule_number ||
    profil.student_id ||
    "N/A";
  const classeVal = profil.classe || "Non assignée";
  const nomComplet = `${profil.prenom || ""} ${profil.nom || ""}`.trim();

  document.getElementById("nomEleve").textContent = nomComplet;
  document.getElementById("nomEleveCarte").textContent = nomComplet;
  document.getElementById("infoNom").textContent = profil.nom || "---";
  document.getElementById("infoPrenom").textContent = profil.prenom || "---";
  document.getElementById("infoClasse").textContent = classeVal;
  document.getElementById("infoMatricule").textContent = matriculeVal;

  // Les cartes indicateurs "Classe" et "Matricule" reprennent les mêmes valeurs
  document.getElementById("statClasse").textContent = classeVal;
  document.getElementById("statMatricule").textContent = matriculeVal;
}

// Construit le tableau des notes en direct de l'élève (toutes matières confondues)
function afficherNotes(notes) {
  const corpsTableau = document.getElementById("corpsNotes"); // Corps du tableau des notes
  if (!corpsTableau) return;

  if (!notes || notes.length === 0) {
    corpsTableau.innerHTML = `<tr><td colspan="2">Aucune note pour le moment.</td></tr>`;
    return;
  }

  corpsTableau.innerHTML = notes
    .map(
      (note) => `
        <tr>
            <td>${echapperHtml(note.matiere)}</td>
            <td class="mono">${note.note}/20</td>
        </tr>
    `,
    )
    .join("");
}

// Construit le tableau des absences de l'élève et met à jour l'indicateur clé associé
function afficherAbsences(absences) {
  const corpsTableau = document.getElementById("corpsAbsences"); // Corps du tableau des absences

  document.getElementById("statAbsences").textContent = absences
    ? absences.length
    : 0; // Indicateur clé "Absences"

  if (!absences || absences.length === 0) {
    corpsTableau.innerHTML = `<tr><td colspan="2">Aucune absence enregistrée.</td></tr>`;
    return;
  }

  corpsTableau.innerHTML = absences
    .map((absence) => {
      // Formatage propre de la date en français (JJ/MM/AAAA) si elle existe
      let dateFormatee = absence.date;
      if (absence.date) {
        const parsedDate = new Date(absence.date);
        if (!isNaN(parsedDate)) {
          dateFormatee = parsedDate.toLocaleDateString("fr-FR");
        }
      }

      return `
            <tr>
                <td class="mono">${dateFormatee}</td>
                <td><span class="badge ${absence.status === "Justifié" ? "ok" : ""}">${echapperHtml(absence.status || "Non justifié")}</span></td>
            </tr>
        `;
    })
    .join("");
}

// Change l'onglet de trimestre actif et recharge le bulletin correspondant
function changerPeriode(periode) {
  periodeActuelle = periode;

  // Un seul onglet "actif" à la fois
  document.querySelectorAll(".onglet-periode").forEach((onglet) => {
    onglet.classList.toggle("actif", onglet.dataset.periode === periode);
  });

  document.getElementById("statPeriodeLabel").textContent = periode; // Libellé de l'indicateur "Moyenne"

  chargerBulletin(periode);
}

// Charge et affiche le bulletin (notes pondérées + moyenne + appréciation) d'un trimestre
async function chargerBulletin(periode) {
  const corpsBulletin = document.getElementById("corpsBulletinEleve");
  corpsBulletin.innerHTML = `<tr><td colspan="3">Chargement...</td></tr>`;

  try {
    const bulletin = await api.get(
      `/api/bulletins/me?periode=${encodeURIComponent(periode)}`,
    );

    // Tableau des notes pondérées du trimestre
    if (!bulletin?.notes || bulletin.notes.length === 0) {
      corpsBulletin.innerHTML = `<tr><td colspan="3">Aucune note pour ce trimestre.</td></tr>`;
    } else {
      corpsBulletin.innerHTML = bulletin.notes
        .map(
          (note) => `
                <tr>
                    <td>${echapperHtml(note.matiere)}</td>
                    <td class="mono">${note.coefficient}</td>
                    <td class="mono">${note.valeur}/20</td>
                </tr>
            `,
        )
        .join("");
    }

    // Moyenne générale du trimestre (carte bulletin + indicateur clé en haut de page)
    const moyenne = bulletin?.moyenneGenerale || "0.00";
    document.getElementById("moyenneBulletinEleve").textContent = moyenne;
    document.getElementById("statMoyenne").textContent = `${moyenne}/20`;

    // Appréciation du professeur pour ce trimestre
    const zoneAppreciation = document.getElementById(
      "appreciationBulletinEleve",
    );
    if (bulletin?.appreciations?.length > 0) {
      zoneAppreciation.textContent = bulletin.appreciations[0].commentaire;
    } else {
      zoneAppreciation.textContent = "Aucune appréciation pour le moment.";
    }
  } catch (erreur) {
    corpsBulletin.innerHTML = `<tr><td colspan="3">Impossible de charger le bulletin.</td></tr>`;
    afficherNotification("Impossible de charger le bulletin", "error");
  }
}
