// services/gradeService.js

import bd from "../db/database.js";

// ==========================
// Ajouter une note
// ==========================

export function ajouterNote(idEleve, idMatiere, note){

    const resultat = bd.prepare(`

        INSERT INTO grades(
            student_id,
            subject_id,
            note
        )

        VALUES (?, ?, ?)

    `).run(
        idEleve,
        idMatiere,
        note
    );

    return resultat.lastInsertRowid;

}

export function listerNotes() {

    const notes = bd.prepare(`
    
        SELECT

            grades.id,

            students.nom,

            students.prenom,

            subjects.nom AS matiere,

            grades.note


        FROM grades


        JOIN students

        ON grades.student_id = students.id


        JOIN subjects

        ON grades.subject_id = subjects.id

    `).all();

    return notes;

}

// ==========================
// Récupérer les notes d'un élève précis
// ==========================

export function listerNotesParEleve(idEleve){

    const notes = bd.prepare(`

        SELECT

            grades.id,

            subjects.nom AS matiere,

            grades.note

        FROM grades

        JOIN subjects

        ON grades.subject_id = subjects.id

        WHERE grades.student_id = ?

    `).all(idEleve);

    return notes;

}

// ==========================
// Récupérer une note
// ==========================

export function obtenirNoteParId(id){

    const note = bd.prepare(`

        SELECT *

        FROM grades

        WHERE id = ?

    `).get(id);

    return note;

}

// ==========================
// Modifier une note
// ==========================

export function modifierNote(
    id,
    idEleve,
    idMatiere,
    note
){

    const resultat = bd.prepare(`


        UPDATE grades

        SET

            student_id = ?,

            subject_id = ?,

            note = ?


        WHERE id = ?


    `).run(
        idEleve,
        idMatiere,
        note,
        id
    );

    return resultat.changes;

}

// ==========================
// Supprimer une note
// ==========================

export function supprimerNote(id){

    const resultat = bd.prepare(`

        DELETE FROM grades

        WHERE id = ?

    `).run(id);

    return resultat.changes;

}
