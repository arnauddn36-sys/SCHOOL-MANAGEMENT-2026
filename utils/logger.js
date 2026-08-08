import fs from "fs";
import path from "path";

const dossierLogs = "./logs";
const fichierLogs = path.join(dossierLogs, "app.log");

// Créer le dossier logs s'il n'existe pas
if (!fs.existsSync(dossierLogs)) {
    fs.mkdirSync(dossierLogs);
}

// Fonction de journalisation
export function journaliser(message) {

    const date = new Date().toLocaleString();

    const texte = `[${date}] ${message}\n`;

    fs.appendFileSync(fichierLogs, texte);

}
