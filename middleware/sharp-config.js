const sharp = require('sharp');
const fs = require('fs');

module.exports = async (req, res, next) => {
  // Si aucun fichier n'a été uploadé via Multer, on passe au middleware suivant
  if (!req.file) {
    return next();
  }

  try {
    // On utilise le chemin enregistré par Multer
    const inputPath = req.file.path;

    // Multer enregistre le fichier SANS extension, donc on ajoute directement .webp au lieu de faire un replace
    const outputPath = inputPath + '.webp';

    /* Sharp lit le fichier original
    puis le convertit en WebP 
    et enregistre le nouveau fichier au chemin défini dans outputPath 
    */
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);

    // On supprime l'ancien fichier. unlinkSync est synchrone : il bloque l'exécution jusqu'à suppression
    fs.unlinkSync(inputPath);

    // On met à jour le nom du fichier pour le contrôleur
    req.file.filename = req.file.filename + '.webp';

    // On passe au middleware suivant
    next();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur conversion image" });
  }
};