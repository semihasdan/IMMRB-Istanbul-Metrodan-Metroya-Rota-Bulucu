const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

// Rota bulma endpoint'i
router.get('/find', routeController.findRoute);

// Tüm istasyonları listeleme endpoint'i
router.get('/stations', routeController.getAllStations);

module.exports = router; 