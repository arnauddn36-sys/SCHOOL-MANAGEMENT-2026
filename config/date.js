// config/date.js
// Petit utilitaire centralisant tout ce qui touche aux dates du projet.

// Renvoie la date du jour au format AAAA-MM-JJ (format attendu par la colonne "date" des absences)
export function dateDuJourISO() {
    return new Date().toISOString().split("T")[0]; // On coupe la partie heure de l'ISO string
}

// Transforme AAAA-MM-JJ en JJ/MM/AAAA pour un affichage plus lisible côté frontend
export function formaterDateFr(dateISO) {
    if (!dateISO) return ""; // Sécurité si la date est vide

    const [annee, mois, jour] = dateISO.split("-"); // On découpe la date ISO
    return `${jour}/${mois}/${annee}`; // On recompose au format français
}
