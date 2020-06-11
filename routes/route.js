let router = require('express').Router();
const express = require('express');
const userController = require('../controllers/userController.js');

router.post('/register', userController.create);
router.post('/authenticate', userController.authenticate);

router.get('/' , function(req,res){
    res.send('API Works');
    });

module.exports = router;

