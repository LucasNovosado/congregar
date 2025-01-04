const express = require('express');
const path = require('path');
const cultController = require(path.join(__dirname, '..', 'controllers', 'cultController'));
const { requireAuth } = require('../controllers/authController');
const router = express.Router();

// Aplica o middleware de autenticação em todas as rotas
router.use(requireAuth);

// Rotas existentes, agora protegidas
router.get('/', cultController.getAllCultData);
router.get('/add', (req, res) => {
    res.render('addCult', { user: req.session.user });
});
router.post('/add', cultController.addCultData);
router.get('/edit/:id', cultController.getEditForm);
router.post('/edit/:id', cultController.updateCultData);
router.post('/delete/:id', cultController.deleteCultData);

module.exports = router;