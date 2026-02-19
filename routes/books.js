const express = require('express');
const router = express.Router();
const booksCtrl = require('../controllers/books');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


/*Renvoie un tableau de tous les livres de la base de données.*/
router.get('/', booksCtrl.getAllBooks);

/*Renvoie un tableau des 3 livres de la base de données ayant la meilleure note moyenne. A PLACER AVANT ID SINON CONFLIT */
router.get('/bestrating', booksCtrl.getBestRating);

/*Renvoie le livre avec l’_id fourni.*/
router.get('/:id', booksCtrl.getOneBook);



/*Capture et enregistre l'image, analyse le livre, transformé en chaîne de caractères, et l'enregistre dans la base de données en déﬁnissant correctement son ImageUrl.
Corps de requete { book: string,
image: ﬁle}
Type de réponse attendue { message: String } Verb 
Initialise la note moyenne du livre à 0 et le rating avec un tableau vide. 
Le corps de la demande initiale est vide ; lorsque Multer est ajouté, il renvoie une chaîne pour le corps de la demande en fonction des données soumises avec le ﬁchier.*/
router.post('/', auth, multer, booksCtrl.createBook);
/*Déﬁnit la note pour le user ID fourni. La note doit être comprise entre 0 et 5.
L'ID de l'utilisateur et la note doivent être ajoutés au tableau "rating" aﬁn de ne pas laisser un utilisateur noter deux fois le même livre. Il n’est pas possible de modiﬁer une note. La note moyenne "averageRating" doit être tenue à jour, et le livre renvoyé en réponse de la requête.*/
router.post('/:id/rating', auth, multer, booksCtrl.createRating);




/* Met à jour le livre avec l'_id fourni. 
Si une image est téléchargée, elle est capturée, et l’ImageUrl du livre est mise à jour. Si aucun ﬁchier n'est fourni, les informations sur le livre se trouvent directement dans le corps de la requête (req.body.title, req.body.author, etc.). 
Si un ﬁchier est fourni, le livre transformé en chaîne de caractères se trouve dans req.body.book. Notez que le corps de la demande initiale est vide ; lorsque Multer est ajouté, il renvoie une chaîne du corps de la demande basée sur les données soumises avec le ﬁchier.
Corps de requete : EITHER Book as JSON OR { book: string, image: ﬁle }
Réponse attendue { message: string }*/
router.put('/:id', auth, multer, booksCtrl.modifyBook);


/*Supprime le livre avec l'_id fourni ainsi que l’image associée.*/
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;