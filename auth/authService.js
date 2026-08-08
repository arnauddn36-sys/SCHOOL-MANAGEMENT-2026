import bd from "../db/database.js";
import { journaliser } from "../utils/logger.js";

export function connexion(nom, prenom, motDePasse) {
    const utilisateur = bd.prepare(`
        SELECT id, nom, prenom, role
        FROM users
        WHERE nom = ? AND prenom = ? AND password = ?
    `).get(nom, prenom, motDePasse);

    if (utilisateur) {
        journaliser(`LOGIN_SUCCESS - ${nom} ${prenom}`);
    } else {
        journaliser(`LOGIN_FAILED - ${nom} ${prenom}`);
    }

    return utilisateur;
}
