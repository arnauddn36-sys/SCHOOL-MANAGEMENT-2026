// public/js/login.js
// Gère la soumission du formulaire de connexion et la redirection vers le bon tableau de bord.

import { enregistrerUtilisateur } from "./auth.js";

const formulaireConnexion = document.getElementById("formulaireConnexion"); // Le formulaire de connexion
const zoneErreur = document.getElementById("erreurConnexion");               // Zone d'affichage des erreurs

// Affiche un message d'erreur sous le formulaire
function afficherErreur(message) {
    zoneErreur.textContent = message; // On place le texte d'erreur
    zoneErreur.hidden = false;         // On rend la zone d'erreur visible
}

formulaireConnexion.addEventListener("submit", async function (evenement) {

    evenement.preventDefault(); // Empêche le rechargement classique de la page

    zoneErreur.hidden = true; // On masque une éventuelle erreur précédente

    // Récupération des valeurs saisies par l'utilisateur
    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const motDePasse = document.getElementById("motDePasse").value;

    if (nom === "" || prenom === "" || motDePasse === "") {
        afficherErreur("Veuillez remplir tous les champs.");
        return; // On arrête ici si un champ est vide
    }

    try {

        const reponseServeur = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // Pas encore de session ici
            body: JSON.stringify({ nom, prenom, password: motDePasse }) // "password" = clé attendue par l'API
        });

        const resultat = await reponseServeur.json(); // Réponse du serveur

        if (!resultat.success) {
            afficherErreur(resultat.message || "Nom ou mot de passe incorrect.");
            return; // Connexion refusée par le serveur
        }

        enregistrerUtilisateur(resultat.user); // On mémorise l'utilisateur connecté (id, nom, prenom, rôle)

        // Redirection vers le tableau de bord correspondant au rôle
        window.location.href = `/html/${resultat.user.role}.html`;

    } catch (erreur) {

        console.error("Erreur connexion :", erreur);
        afficherErreur("Nom ou mot de passe incorrect.");
    }
});
