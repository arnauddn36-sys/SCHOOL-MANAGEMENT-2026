// public/js/ui.js
// Petit utilitaire d'interface partagé par tous les tableaux de bord :
// affiche une notification discrète en bas de l'écran au lieu d'un alert() bloquant,
// et échappe le texte injecté dans le HTML pour éviter les soucis d'affichage.

// Affiche une notification temporaire ("toast") en bas à droite de l'écran
export function afficherNotification(message, type = "success") {

    let conteneur = document.getElementById("conteneurNotifications"); // Zone qui contient les notifications

    if (!conteneur) {
        conteneur = document.createElement("div");  // On crée la zone si elle n'existe pas encore
        conteneur.id = "conteneurNotifications";        // Identifiant pour la retrouver ensuite
        conteneur.style.position = "fixed";              // Toujours visible, même en scrollant
        conteneur.style.bottom = "20px";                   // Collé en bas de l'écran
        conteneur.style.right = "20px";                      // Collé à droite de l'écran
        conteneur.style.display = "flex";                       // Empile plusieurs notifications
        conteneur.style.flexDirection = "column";                 // Direction verticale
        conteneur.style.gap = "10px";                               // Espace entre les notifications
        conteneur.style.zIndex = "1000";                              // Toujours au-dessus du reste
        document.body.appendChild(conteneur);                          // Ajout dans la page
    }

    const notification = document.createElement("div"); // La notification elle-même
    notification.textContent = message;                    // Texte du message
    notification.style.padding = "12px 18px";                // Espace intérieur
    notification.style.borderRadius = "8px";                   // Coins arrondis
    notification.style.color = "#ffffff";                        // Texte blanc
    notification.style.fontFamily = "'Plus Jakarta Sans', sans-serif"; // Police cohérente avec le thème
    notification.style.fontSize = "14px";                            // Taille de texte
    notification.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";      // Ombre pour détacher la notification
    notification.style.backgroundColor = type === "error" ? "#ef4444" : "#00b871"; // Couleur selon le type

    conteneur.appendChild(notification); // On affiche la notification

    setTimeout(() => notification.remove(), 3200); // Disparaît automatiquement après 3,2s
}

// Échappe les caractères spéciaux HTML pour éviter d'injecter du code involontairement
export function echapperHtml(valeur) {

    const element = document.createElement("div"); // Élément temporaire jamais ajouté à la page
    element.textContent = valeur ?? "";               // On y place le texte brut
    return element.innerHTML;                          // Le navigateur nous rend la version échappée
}

// Demande une confirmation avant une action destructive (suppression)
export function confirmerAction(message) {
    return window.confirm(message); // Simple confirmation native du navigateur
}
