let router = require('express').Router();
const express = require('express');
const userController = require('../controllers/userController.js');

router.get('/' , function(req,res){
    res.send('API Works');
});

router.route('/emailactivate')
    .post(userController.confirmation);

router.post('/register', userController.create);
router.post('/authenticate', userController.authenticate);

module.exports = router;

