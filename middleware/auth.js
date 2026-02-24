const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
        /*
       const token = req.headers.authorization.split(' ')[1];
       Si req.headers.authorization est undefined, crash immédiat.
       Correction qui vérifie que le header existe avant de l’utiliser et permet de renvoyer une erreur claire au lieu d’un crash.:
       */
       if (!req.headers.authorization) {
        return res.status(401).json({ message: "Token manquant ou invalide" });
        }
        const token = req.headers.authorization.split(' ')[1];
        /*fin de correction*/
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };

    next();

   } catch (error) {
    return res.status(401).json({ message: "Requête non authentifiée" });
  }
};

