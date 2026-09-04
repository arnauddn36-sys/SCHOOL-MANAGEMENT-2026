import { genererBulletinEleve } from "../services/bulletinService.js";

export async function recupererBulletin(req, res) {
    try {
        const { idEleve } = req.params;
        const periode = req.query.periode || 'Trimestre 1';

        const bulletin = await genererBulletinEleve(idEleve, periode);

        if (!bulletin) {
            return res.status(404).json({ erreur: "Élève non trouvé." });
        }

        res.json(bulletin);
    } catch (erreur) {
        console.error("Erreur lors de la récupération du bulletin :", erreur);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
}