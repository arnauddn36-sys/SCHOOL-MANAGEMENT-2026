import bd from "../db/database.js";

// ==========================
// Ajouter un professeur
// ==========================

export function ajouterProfesseur(nom, prenom) {

    const resultat = bd.prepare(`

        INSERT INTO teachers(
            nom,
            prenom
        )

        VALUES (?, ?)

    `).run(
        nom,
        prenom
    );

    return resultat.lastInsertRowid;

}

// ==========================
// Récupérer un professeur par ID
// ==========================

export function obtenirProfesseurParId(id) {

    const professeur = bd.prepare(`

        SELECT *

        FROM teachers

        WHERE id = ?

    `).get(id);

    return professeur;

}

// ==========================
// Lister les professeurs avec leurs matières
// ==========================

export function listerProfesseurs() {

    const professeurs = bd.prepare(`

        SELECT

            teachers.id,

            teachers.nom,

            teachers.prenom,


            GROUP_CONCAT(subjects.nom) AS matieres


        FROM teachers


        LEFT JOIN teacher_subjects

        ON teachers.id = teacher_subjects.teacher_id


        LEFT JOIN subjects

        ON teacher_subjects.subject_id = subjects.id


        GROUP BY teachers.id


    `).all();

    return professeurs.map(professeur => ({

        ...professeur,

        matieres: professeur.matieres

            ? professeur.matieres.split(",")

            : []

    }));

}

// ==========================
// Récupérer le professeur lié à un compte utilisateur (espace "Mon profil")
// ==========================

export function obtenirProfesseurParUtilisateur(idUtilisateur) {

    const professeur = bd.prepare(`

        SELECT *

        FROM teachers

        WHERE user_id = ?

    `).get(idUtilisateur);

    return professeur;

}

// ==========================
// Modifier un professeur
// ==========================

export function modifierProfesseur(id, nom, prenom) {

    const resultat = bd.prepare(`

        UPDATE teachers

        SET

            nom = ?,

            prenom = ?


        WHERE id = ?

    `).run(

        nom,

        prenom,

        id

    );

    return resultat.changes;

}

// ==========================
// Supprimer un professeur
// ==========================

export function supprimerProfesseur(id) {

    // Supprime les associations professeur-matière

    bd.prepare(`

        DELETE FROM teacher_subjects

        WHERE teacher_id = ?

    `).run(id);

    // Supprime le professeur

    const resultat = bd.prepare(`

        DELETE FROM teachers

        WHERE id = ?

    `).run(id);

    return resultat.changes;

}

// ==========================
// Assigner une matière
// ==========================

export function attribuerMatiere(idProfesseur, idMatiere) {

    const resultat = bd.prepare(`

        INSERT INTO teacher_subjects(

            teacher_id,

            subject_id

        )

        VALUES (?, ?)

    `).run(

        idProfesseur,

        idMatiere

    );

    return resultat.changes;

}

// ==========================
// Liste des matières (disponible aussi via subjectService.js)
// ==========================

export function listerMatieresDisponibles() {

    return bd.prepare(`

        SELECT *

        FROM subjects

    `).all();

}
