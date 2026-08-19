// public/js/register.js
// Gère la soumission du formulaire d'inscription (élève uniquement).
// Après une inscription réussie, redirige vers la page de connexion.

const formulaireInscription = document.getElementById("formulaireInscription");
const zoneMessage = document.getElementById("messageInscription");

// Affiche un message (erreur en rouge, succès en vert) sous le formulaire
function afficherMessage(message, type) {
    zoneMessage.textContent = message;
    zoneMessage.style.color = type === "success" ? "#0e9c8c" : "#ff5252";
    zoneMessage.hidden = false;
}

formulaireInscription.addEventListener("submit", async function (evenement) {

    evenement.preventDefault(); // Empêche le rechargement classique de la page

    zoneMessage.hidden = true; // On masque un éventuel message précédent

    // Récupération des valeurs saisies
    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const email = document.getElementById("email").value.trim();
    const matricule = document.getElementById("matricule").value.trim();
    const age = document.getElementById("age").value;
    const classe = document.getElementById("classe").value.trim();
    const motDePasse = document.getElementById("motDePasse").value;
    const confirmationMotDePasse = document.getElementById("confirmationMotDePasse").value;

    if (nom === "" || prenom === "" || email === "" || matricule === "" || age === "" || classe === "" || motDePasse === "" || confirmationMotDePasse === "") {
        afficherMessage("Veuillez remplir tous les champs.", "error");
        return;
    }

    // Vérification côté client (le serveur revérifie aussi, ne jamais faire
    // confiance uniquement à une validation frontend)
    if (motDePasse !== confirmationMotDePasse) {
        afficherMessage("Les mots de passe ne correspondent pas.", "error");
        return;
    }

    try {

        const reponseServeur = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom, prenom, email, matricule, age, classe, password: motDePasse, confirmationMotDePasse })
        });

        const resultat = await reponseServeur.json();

        if (!resultat.success) {
            afficherMessage(resultat.message || "Impossible de créer le compte.", "error");
            return;
        }

        afficherMessage("Compte créé avec succès ! Redirection vers la connexion...", "success");

        // Petite pause pour laisser le temps de lire le message avant la redirection
        setTimeout(() => {
            window.location.href = "/html/index.html";
        }, 1500);

    } catch (erreur) {

        console.error("Erreur inscription :", erreur);
        afficherMessage("Erreur lors de la connexion au serveur.", "error");
    }
});