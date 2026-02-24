/*Imports*/
const express = require('express'); /*à installer dans le package.json pour chaque projet body-parser n'est plus necessaire car express le prend en charge*/
const mongoose = require("mongoose"); /*pour faciliter les interactions avec la database MongoDB avec schémas de données, lecture et écriture directe*/
const path = require('path'); /*pour gérer les chemins de fichiers et de dossiers*/

// Copy the .env.example in the root into a .env file in this folder
const envFilePath = path.resolve(__dirname, `.env`);
const env = require("dotenv").config({ path: envFilePath });

const booksRoutes = require('./routes/books-routes');
const userRoutes = require('./routes/user-routes')

mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.error('Erreur de connexion :', err));

/* framework node express pour les fonctions middleware*/
const app = express();

/*Cross Origin Resource Sharing CORS pour autoriser des serveurs différents à communiquer*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

/*début de routes communs */
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

/* Export pour l'accès depuis d'autres fichiers */
module.exports = app;