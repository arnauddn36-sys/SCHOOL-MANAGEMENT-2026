import bd from "../db/database.js";

// ==========================
// Ajouter une matière à un professeur
// ==========================

export function attribuerMatiere(idProfesseur, idMatiere){

    const resultat = bd.prepare(`

        INSERT INTO teacher_subjects(
            teacher_id,
            subject_id
        )

        VALUES(?, ?)

    `)
    .run(
        idProfesseur,
        idMatiere
    );

    return resultat.lastInsertRowid;

}

// ==========================
// Voir les matières d'un professeur
// ==========================

export function obtenirMatieresProfesseur(idProfesseur){

    const matieres = bd.prepare(`

        SELECT

            subjects.id,
            subjects.nom

        FROM subjects


        JOIN teacher_subjects

        ON subjects.id = teacher_subjects.subject_id


        WHERE teacher_subjects.teacher_id = ?

    `)
    .all(idProfesseur);

    return matieres;

}

// ==========================
// Retirer une matière
// ==========================

export function retirerMatiere(
    idProfesseur,
    idMatiere
){

    const resultat = bd.prepare(`

        DELETE FROM teacher_subjects

        WHERE teacher_id = ?

        AND subject_id = ?

    `)
    .run(
        idProfesseur,
        idMatiere
    );

    return resultat.changes;

}
