const mongoose = require('mongoose');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//Add user to database function CREATE
exports.create = function (req,res,next) {
    User.create({ name: req.body.name, email: req.body.email, password: req.body.password }, function (err, result) {
        if (err)
            next(err);
        else
            res.json({status: "success", message: "User added successfully", data: null});
});
};

//authenticate function
exports.authenticate = function (req,res,next) {
    User.findOne({email: req.body.email}, function (err, userInfo) {
        if (err) {
            next(err);
        } else {
            if(bcrypt.compareSync(req.body.password, userInfo.password)) {
                const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), { expiresIn: '1h' });
                res.json({status:"success", message: "user found!", data:{user: userInfo, token:token}});
            }
            else{
                res.json({status:"error", message: "Invalid email/password!!!", data:null});
            }
        }
    });
}