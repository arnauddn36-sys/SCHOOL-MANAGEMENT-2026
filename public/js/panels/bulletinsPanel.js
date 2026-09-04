// public/js/panels/bulletinsPanel.js

import { api } from "../api.js";
import { afficherNotification, echapperHtml } from "../ui.js";

export async function afficherPanneauBulletins(contenuElement) {
    // 1. Injecter la structure HTML du panneau des bulletins
    contenuElement.innerHTML = `
        <div class="bulletin-container glass-card">
            <h2>Bulletin de Notes & Appréciations</h2>
            
            <!-- Filtres de sélection -->
            <div class="bulletin-filters">
                <select id="select-eleve" class="glass-input">
                    <option value="">-- Choisir un élève --</option>
                </select>
                
                <select id="select-periode" class="glass-input">
                    <option value="Trimestre 1">Trimestre 1</option>
                    <option value="Trimestre 2">Trimestre 2</option>
                    <option value="Trimestre 3">Trimestre 3</option>
                </select>
                
                <button id="btn-charger-bulletin" class="glass-btn">Afficher le bulletin</button>
            </div>

            <!-- Affichage du Bulletin -->
            <div id="bulletin-resultat" class="bulletin-sheet hidden">
                <div class="bulletin-header">
                    <h3>Bulletin Scolaire - <span id="bul-periode-nom"></span></h3>
                    <p>Élève : <span id="bul-eleve-nom"></span></p>
                </div>

                <table class="glass-table">
                    <thead>
                        <tr>
                            <th>Matière</th>
                            <th>Coefficient</th>
                            <th>Note /20</th>
                        </tr>
                    </thead>
                    <tbody id="bul-notes-body">
                        <!-- Les notes s'afficheront ici -->
                    </tbody>
                </table>

                <div class="bulletin-footer-info">
                    <p class="moyenne-box">Moyenne Générale : <strong id="bul-moyenne">--</strong> /20</p>
                    <div class="appreciation-box">
                        <h4>Appréciation du Conseil / Professeur :</h4>
                        <p id="bul-commentaire">Aucune appréciation pour le moment.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const selectEleve = document.getElementById("select-eleve");
    const selectPeriode = document.getElementById("select-periode");
    const btnCharger = document.getElementById("btn-charger-bulletin");
    const bulletinResultat = document.getElementById("bulletin-resultat");

    // Charger la liste des élèves pour alimenter le select
    async function chargerEleves() {
        console.log("Tentative de chargement des élèves...");
        try {
            // Utilisation de ton module `api` centralisé qui gère déjà le token et les en-têtes
            const resultat = await api.get("/api/students");
            
            console.log("Données reçues pour les élèves :", resultat);
            
            const eleves = Array.isArray(resultat) ? resultat : (resultat.students || resultat.data || []);
            
            selectEleve.innerHTML = '<option value="">-- Choisir un élève --</option>';
            if (Array.isArray(eleves)) {
                eleves.forEach(eleve => {
                    selectEleve.innerHTML += `<option value="${eleve.id}">${echapperHtml(eleve.prenom)} ${echapperHtml(eleve.nom)}</option>`;
                });
            }
        } catch (erreur) {
            console.error("Erreur chargement élèves:", erreur);
            afficherNotification("Impossible de charger la liste des élèves", "error");
        }
    }

    // Appel de la fonction de chargement dès l'affichage du panneau
    await chargerEleves();

    // Gérer le clic sur le bouton pour récupérer et afficher le bulletin
    btnCharger.addEventListener("click", async () => {
        const idEleve = selectEleve.value;
        const periode = selectPeriode.value;

        if (!idEleve) {
            alert("Veuillez sélectionner un élève.");
            return;
        }

        try {
            const data = await api.get(`/api/bulletins/${idEleve}?periode=${encodeURIComponent(periode)}`);

            document.getElementById("bul-periode-nom").textContent = data.periode || periode;
            document.getElementById("bul-eleve-nom").textContent = data.eleve ? `${data.eleve.prenom} ${data.eleve.nom}` : "";
            document.getElementById("bul-moyenne").textContent = data.moyenneGenerale || "0.00";

            const tbody = document.getElementById("bul-notes-body");
            tbody.innerHTML = "";
            if (data.notes && data.notes.length > 0) {
                data.notes.forEach(n => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${echapperHtml(n.matiere || n.subject_name || "")}</td>
                            <td>${n.coefficient || 1}</td>
                            <td>${n.valeur || n.grade || 0}</td>
                        </tr>
                    `;
                });
            } else {
                tbody.innerHTML = `<tr><td colspan="3">Aucune note enregistrée pour cette période.</td></tr>`;
            }

            const comBox = document.getElementById("bul-commentaire");
            if (data.appreciations && data.appreciations.length > 0) {
                comBox.textContent = data.appreciations[0].commentaire;
            } else {
                comBox.textContent = "Aucune appréciation pour le moment.";
            }

            bulletinResultat.classList.remove("hidden");

        } catch (erreur) {
            console.error("Erreur:", erreur);
            alert("Impossible de charger le bulletin.");
        }
    });
}