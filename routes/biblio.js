const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const biblioCtrl = require('../controllers/biblio');

router.get('/', auth, biblioCtrl.getAllBooks);
router.post('/', auth, multer, biblioCtrl.createBook);
router.get('/:id', auth, biblioCtrl.getOneBook);
router.put('/:id', auth, multer, biblioCtrl.modifyBook);
router.delete('/:id', auth, biblioCtrl.deleteBook);

module.exports = router;