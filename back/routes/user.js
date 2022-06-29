const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit')

const userCtrl = require('../controllers/user');

const limitconnections = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // start blocking after 10 requests
    message: 'Trop de connexions, veuillez réessayer dans quelques minutes'
});

router.post('/signup', userCtrl.signup)
router.post('/login', limitconnections, userCtrl.login);

module.exports = router;