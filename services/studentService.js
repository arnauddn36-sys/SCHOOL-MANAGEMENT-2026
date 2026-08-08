// services/studentService.js
// Toute la logique d'accès à la base de données pour les élèves.
// Chaque fonction retourne des données (au lieu de faire console.log) car elles
// sont maintenant consommées par les contrôleurs de l'API Express.

import bd from "../db/database.js"; // Connexion à la base SQLite

// ==========================
// Ajouter un élève
// ==========================
export function ajouterEleve(matricule, nom, prenom, age, classe, idUtilisateur = null) {

    const resultat = bd.prepare(`
        INSERT INTO students(matricule, nom, prenom, age, classe, user_id)
        VALUES(?, ?, ?, ?, ?, ?)
    `).run(matricule, nom, prenom, age, classe, idUtilisateur);

    return resultat.lastInsertRowid; // On renvoie l'id généré pour l'élève créé
}

// ==========================
// Lister tous les élèves
// ==========================
export function listerEleves() {

    return bd.prepare(`
        SELECT * FROM students
    `).all(); // .all() renvoie toutes les lignes sous forme de tableau d'objets
}

// ==========================
// Récupérer un élève par son id
// ==========================
export function obtenirEleveParId(id) {

    return bd.prepare(`
        SELECT * FROM students WHERE id = ?
    `).get(id); // .get() renvoie une seule ligne (ou undefined si absente)
}

// ==========================
// Récupérer l'élève lié à un compte utilisateur (espace "Mon profil")
// ==========================
export function obtenirEleveParUtilisateur(idUtilisateur) {

    return bd.prepare(`
        SELECT * FROM students WHERE user_id = ?
    `).get(idUtilisateur);
}

// ==========================
// Modifier un élève
// ==========================
export function modifierEleve(id, matricule, nom, prenom, age, classe) {

    const resultat = bd.prepare(`
        UPDATE students
        SET matricule = ?, nom = ?, prenom = ?, age = ?, classe = ?
        WHERE id = ?
    `).run(matricule, nom, prenom, age, classe, id);

    return resultat.changes; // Nombre de lignes modifiées (0 si l'id n'existe pas)
}

// ==========================
// Supprimer un élève
// ==========================
export function supprimerEleve(id) {

    const resultat = bd.prepare(`
        DELETE FROM students WHERE id = ?
    `).run(id);

    return resultat.changes; // Nombre de lignes supprimées (0 si l'id n'existe pas)
}
