let express = require('express');
let server = express();
let cors = require('cors');
let bodyParser = require('body-parser');
let routes = require('./routes/route.js');
let mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('./config/config.js')

server.set('secretKey', 'nodeRestApi'); // jwt secret token
server.use(cors());

//Database configuration
mongoose.connect(config.dbConfig.uri, { useNewUrlParser: true});
var db = mongoose.connection;

server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());
var port = process.env.PORT || 3000;
server.listen(port , function () {
    console.log("running rest api on port " + port);
});

//set up route middleware
server.get( '/' , (req,res) => res.send('You can reach API endpoint list from /api'));

server.use('/users', routes);
server.use('/movies' , validateUser , routes);

//Wrong route request handling
server.use((req,res) => {
    res.send("404 not found");
});


function validateUser(req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
        if (err) {
            res.json({status:"error", message: err.message, data:null});
        }else{
            // add user id to request
            req.body.userId = decoded.id;
            next();
        }
    });

}

module.exports = server;