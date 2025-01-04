const express = require('express');
const path = require('path');
const cultController = require(path.join(__dirname, '..', 'controllers', 'cultController'));
const router = express.Router();

router.get('/', cultController.getAllCultData);

// Rota para exibir o formulário de adição
router.get('/add', (req, res) => {
    res.render('addCult');
});

router.post('/add', cultController.addCultData);
router.get('/edit/:id', cultController.getEditForm);
router.post('/edit/:id', cultController.updateCultData); // Mudou de /update para /edit
router.post('/delete/:id', cultController.deleteCultData);

module.exports = router;