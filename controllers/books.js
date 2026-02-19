const Book = require('../models/Book');
const fs = require('fs');


exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => { 
        res.status(200).json(books);})
    .catch((error) => {
        res.status(400).json({ error: error });});
};

exports.getBestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // Trie par note décroissante
    .limit(3) // Limite à 3 résultats
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};


exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
       ...bookObject, 
       userId: req.auth.userId,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   });

  book.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({_id: req.params.id})
    .then((book) => { res.status(200).json(book); })
    .catch((error) => { res.status(404).json({ error: error }); }); 
};

exports.modifyBook = (req, res, next) => {
   const bookObject = req.file ? {
       ...JSON.parse(req.body.thing),
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };
 
   delete bookObject._userId;
   Book.findOne({_id: req.params.id})
       .then((book) => {
           if (book.userId != req.auth.userId) {
               res.status(401).json({ message : 'Not authorized'});
           } else {
               Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
               .then(() => res.status(200).json({message : 'Objet modifié!'}))
               .catch(error => res.status(401).json({ error }));
           }
       })
       .catch((error) => {
           res.status(400).json({ error });
       });
};

exports.deleteBook = (req, res, next) => {
   Book.findOne({ _id: req.params.id})
       .then(book => {
           if (book.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = book.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Book.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};



exports.createRating = (req, res, next) => {
  const userId = req.auth.userId;
  const { rating } = req.body;

  if (rating < 0 || rating > 5) {  
    return res.status(400).json({ error: "La note doit être comprise entre 0 et 5." });
  }

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: "Livre non trouvé." });
      }

      const alreadyRated = book.ratings.some((r) => r.userId === userId);
      if (alreadyRated) {
        return res.status(400).json({ error: "Vous avez déjà noté ce livre." });
      }

      // Ajout de la note
      book.ratings.push({ userId, grade: rating });

      // Recalcul de la moyenne
      const totalRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating = totalRatings / book.ratings.length;

      /* Ancienne sauvegarde des modifications
                  book.save() // ❌ Problème : Pas de gestion des promesses/erreurs
                    .then(() => {
                      res.status(200).json(book);
                    })
                    .catch((error) => {
                      res.status(400).json({ error: error });
                    });
                })
                .catch((error) => {
                  res.status(500).json({ error: error });
                });
                */
      // ---MODIFICATION
      // Utilisation de async/await , avec gestion d'erreur locale
      (async () => {
        try {
          const savedBook = await book.save({ validateBeforeSave: true });
          console.log("Livre sauvegardé avec succès:", savedBook.ratings);  // Log de confirmation
          res.status(200).json(savedBook);
        } catch (error) {
          console.error("Erreur lors de la sauvegarde:", error);  // Log d'erreur détaillé
          res.status(500).json({ error: error.message });
        }
      })();
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};

/*
await :
Force l'exécution à attendre que book.save() termine avant de continuer.
Évite les comportements asynchrones imprévisibles (comme envoyer une réponse avant que la sauvegarde ne soit terminée).

try/catch :
Capture toutes les erreurs (y compris les erreurs de validation ou de connexion à MongoDB).
Affiche des logs détaillés (console.error) pour diagnostiquer les problèmes.

const savedBook = ... :
Stocke le résultat de save() dans une variable, ce qui permet de :
Vérifier que la sauvegarde a réussi (via console.log).
Retourner les données mises à jour dans la réponse (res.status(200).json(savedBook)).
*/