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
router.post('/update/:id', cultController.updateCultData);
router.post('/delete/:id', cultController.deleteCultData);

module.exports = router;
