const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

/*Hachage du mot de passe de l'utilisateur, ajout de
l'utilisateur à la base de données.*/
router.post('/signup', userCtrl.signup);
/*Vériﬁcation des informations d'identiﬁcation de
l'utilisateur ; renvoie l’_id de l'utilisateur depuis la
base de données et un token web JSON signé
(contenant également l'_id de l'utilisateur).*/
router.post('/login', userCtrl.login);

module.exports = router;

/*CONNECTION_STRING=mongodb+srv://AdminIZ:AdminIZmp2026@grimoires.wfzh0xe.mongodb.net/?appName=Grimoires?retryWrites=true&w=majority
PORT=4000 */