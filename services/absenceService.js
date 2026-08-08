// services/absenceService.js
// Logique d'accès à la base de données pour les absences.

import bd from "../db/database.js"; // Connexion à la base SQLite

// ==========================
// Ajouter une absence
// ==========================
export function ajouterAbsence(idEleve, date, statut) {

    const resultat = bd.prepare(`
        INSERT INTO absences (student_id, date, status)
        VALUES (?, ?, ?)
    `).run(idEleve, date, statut);

    return resultat.lastInsertRowid; // Id de l'absence créée
}

// ==========================
// Lister toutes les absences (avec le nom de l'élève concerné)
// ==========================
export function listerAbsences() {

    return bd.prepare(`
        SELECT
            absences.id,
            absences.date,
            absences.status,
            students.nom,
            students.prenom
        FROM absences
        JOIN students ON absences.student_id = students.id
        ORDER BY absences.date DESC
    `).all();
}

// ==========================
// Lister les absences d'un élève précis (espace élève / professeur)
// ==========================
export function listerAbsencesParEleve(idEleve) {

    return bd.prepare(`
        SELECT id, date, status
        FROM absences
        WHERE student_id = ?
        ORDER BY date DESC
    `).all(idEleve);
}

// ==========================
// Récupérer une absence par son id
// ==========================
export function obtenirAbsenceParId(id) {

    return bd.prepare(`
        SELECT * FROM absences WHERE id = ?
    `).get(id);
}

// ==========================
// Modifier une absence
// ==========================
export function modifierAbsence(id, idEleve, date, statut) {

    const resultat = bd.prepare(`
        UPDATE absences
        SET student_id = ?, date = ?, status = ?
        WHERE id = ?
    `).run(idEleve, date, statut, id);

    return resultat.changes; // Nombre de lignes modifiées
}

// ==========================
// Supprimer une absence
// ==========================
export function supprimerAbsence(id) {

    const resultat = bd.prepare(`
        DELETE FROM absences WHERE id = ?
    `).run(id);

    return resultat.changes; // Nombre de lignes supprimées
}
