/*Imports*/
const express = require('express'); /*à installer dans le package.json pour chaque projet*/
const bodyParser = require ('body-parser')
const mongoose = require ("mongoose"); /*pour faciliter les interactions avec la database MongoDB avec schémas de données, lecture et écriture directe*/

const biblioRoutes = require('./routes/biblio');
const userRoutes = require('./routes/user')
const path = require('path');

/*Connexion au cluster de la database NoSQL MongoDB*/

mongoose.connect('mongodb+srv://AdminIZ:AdminIZmp2026@grimoires.wfzh0xe.mongodb.net/?appName=Grimoires?retryWrites=true&w=majority')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.error('Erreur de connexion :', err));

/* utilisation du framework node express pour les fonctions middleware*/
const app = express();

/*Cross Origin Resource Sharing CORS pour autoriser des serveurs différents à communiquer*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());
/*app.use(bodyParser.json());*/

/*enregistrement du début de routes communs pour les routes déplacées dans stuff.js */
app.use('/api/biblio', biblioRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

/* Expost de la constante app pour pouvoir y acceder depuis d'autres fichiers */
module.exports = app;