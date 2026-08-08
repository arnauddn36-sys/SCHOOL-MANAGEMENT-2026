// models/students.js
// Ce fichier ne contient pas de logique : il documente la forme d'un élève
// tel qu'il est stocké dans la table SQLite "students" (voir db/database.js).
// Cela sert de référence rapide pour savoir quels champs manipuler dans les services/contrôleurs.

/**
 * @typedef {Object} Eleve
 * @property {number} id          - Identifiant unique généré par SQLite
 * @property {string} matricule   - Numéro d'identification unique de l'élève (ex: MAT-2026-021)
 * @property {string} nom         - Nom de famille de l'élève
 * @property {string} prenom      - Prénom de l'élève
 * @property {number} age         - Âge de l'élève
 * @property {string} classe      - Classe de l'élève (ex: "1er A1")
 * @property {number|null} user_id - Compte de connexion lié (role = "student"), ou null si aucun
 */

export {}; // Fichier de documentation uniquement (aucun export réel nécessaire)
