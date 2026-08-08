import bd from "../db/database.js";

// ==========================
// Ajouter une matière
// ==========================

export function ajouterMatiere(nom){

    const resultat = bd.prepare(`

        INSERT INTO subjects(
            nom
        )

        VALUES(?)

    `).run(
        nom
    );

    return resultat.lastInsertRowid;

}

// ==========================
// Lister les matières
// ==========================

export function listerMatieres(){

    const matieres = bd.prepare(`

        SELECT *

        FROM subjects

    `).all();

    return matieres;

}

// ==========================
// Récupérer une matière par ID
// ==========================

export function obtenirMatiereParId(id){

    const matiere = bd.prepare(`

        SELECT *

        FROM subjects

        WHERE id = ?

    `).get(id);

    return matiere;

}

// ==========================
// Modifier une matière
// ==========================

export function modifierMatiere(id, nom){

    const resultat = bd.prepare(`

        UPDATE subjects

        SET nom = ?

        WHERE id = ?

    `).run(

        nom,

        id

    );

    return resultat.changes;

}

// ==========================
// Supprimer une matière
// ==========================

export function supprimerMatiere(id){

    // Supprimer les associations professeur-matière

    bd.prepare(`

        DELETE FROM teacher_subjects

        WHERE subject_id = ?

    `).run(id);

    // Supprimer la matière

    const resultat = bd.prepare(`

        DELETE FROM subjects

        WHERE id = ?

    `).run(id);

    return resultat.changes;

}
