let utilisateurActuel = null;

// Cette fonction permet de savoir quel utilisateur est connecté
export function definirUtilisateur(utilisateur) {
    utilisateurActuel = utilisateur;
}

export function obtenirUtilisateur() {
    return utilisateurActuel;
}

export function deconnexion() {
    utilisateurActuel = null;
}
