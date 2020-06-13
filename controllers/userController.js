const mongoose = require('mongoose');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Token = require('../models/verificationtoken.js');
const nodemailer = require('nodemailer');
const crypto = require('crypto')

//Add user to database function CREATE
exports.create = function (req,res,next) {
    User.create({ name: req.body.name, email: req.body.email, password: req.body.password }, function (err, result) {
        if (err)
            next(err);
        else
            var token = new Token({ _userId: result._id, token: crypto.randomBytes(16).toString('hex') });
            token.save(function (err) {
                if (err) {
                    return res.status(500).send({msg: err.message});
                }

                // Send the email
                let transporter = nodemailer.createTransport({
                    host: "smtp.sendgrid.net",
                    port: 587,
                    secure: false,
                    auth: {
                        user: "apikey",
                        pass: "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"
                    }
                });
                var mailInfo = {
                    from: 'ematecompany@gmail.com ', to: result.email, subject: 'Account Verification Token',
                    text: 'Hello,\n\n' + 'Please verify your account by entering token when log in: '+ token.token + '\n'
                };
                transporter.sendMail(mailInfo, function (err) {
                    if (err) {
                        return res.status(500).send({msg: err.message});
                    }
                    res.json({status: "success", message: 'A verification email has been sent to ' + result.email + '.', data: null});
                });

            });
});
};

//authenticate function
exports.authenticate = function (req,res,next) {
    User.findOne({email: req.body.email}, function (err, userInfo) {
        if (err) {
            next(err);
        } else {
            if(bcrypt.compare(req.body.password, userInfo.password)) {
                const tok = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), { expiresIn: '1h' });
                res.json({status:"success", message: "user found!", data:{user: userInfo, token:tok}});
            }
            else{
                res.json({status:"error", message: "Invalid email/password!!!", data:null});
            }
        }
    });
}

exports.confirmation = function(req,res,next) {
    Token.findOne({token: req.body.token} ,function (err,token) {
        if(!token)
            return res.status(400).send({type:'not-verified' , msg: 'we were unable to find a valid token or token expired'})

        User.findOne({_id : token._userId } , function (err,user) {
            if(!user)
                return res.status(400).send({type:'no-token' ,msg:'we were unable to find a user for this token'})
            if(user.isVerified)
                return res.status(400).send({type: 'already-verified' , msg:'this user already verified'})

            //verify user and save it
            user.isVerified = true;
            user.save(function (err) {
                if(err){
                    return res.status(500).send({ msg: err.message });
                }
                res.status(200).send("the account has been verified.Please log in")
            });
        });
    });

}