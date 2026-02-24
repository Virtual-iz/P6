const multer = require('multer');

/* Liste des types d’images autorisés.*/
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

/* Enregistrement dans le dossier "images" avant que Sharp ne les convertisse en .webp */
const storage = multer.diskStorage({

  /* définit le dossier où les fichiers uploadés seront stockés.*/
  destination: (req, file, callback) => {
    callback(null, 'images');
  },

  /* Définit le nom du fichier enregistré sur le serveur. 
  Supprimee l’extension d’origine (car Sharp ajoutera .webp), les espaces, et ajoute un timestamp pour garantir un nom unique
  */
  filename: (req, file, callback) => {

    /*
    file.originalname contient le nom complet envoyé par l’utilisateur
    split('.')[0] supprime l’extension d’origine (jpg/png/etc).
    split(' ').join('_') remplace les espaces par des underscores pour éviter les problèmes d’URL.
    */
    const name = file.originalname.split('.')[0].split(' ').join('_');

    /*Date.now() :Ajoute un timestamp en millisecondes.*/
    callback(null, name + Date.now());
  }
});

/*.single('image') signifie :
On attend un seul fichier dans le champ nommé "image"
(correspond au champ envoyé par le frontend).
L’ordre d’exécution dans les routes sera :
auth → multer → sharp → controller
*/
module.exports = multer({ storage: storage }).single('image');