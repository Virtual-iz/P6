const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
        /*
       Vérifie si le header existe ou renvoi une erreur:
       */
       if (!req.headers.authorization) {
        return res.status(401).json({ message: "Token manquant ou invalide" });
        }
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };

    next();
    /*
      Si tout est ok, prochain middleware
    */

   } catch (error) {
    return res.status(401).json({ message: "Requête non authentifiée" });
  }
};

