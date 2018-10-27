const User = require('../models/users.model.js');
const truffle_connect = require('../../connection/app.js');

// Create and Save a new User
exports.create = (req, res) => {


    // Validate request
    if(!req.body.username) {
        return res.status(400).send({
            message: "username can not be empty"
        });
    }else if(!req.body.password) {
        return res.status(400).send({
            message: "password can not be empty"
        });
    }else if(!req.body.usertype) {
        return res.status(400).send({
            message: "usertype can not be empty"
        });
    }

    truffle_connect.createAccount(req.body.password,(address)=>{
        // Create a User
    const user = new User({
        username:req.body.username,
        password:req.body.password,
        usertype:req.body.usertype,
        blockchainId:address
    });
    // Save user in the database
    user.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the user."
        });
    });
    });
};

// Find a single user with a username
exports.findOne = (req, res) => {
   User.find({"username":req.body.username,"password":req.body.password})
    .then(user => {
        if(user.length===0) {
            return res.status(404).send({
                message: "Invalid username or password."
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.username
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.username
        });
    });
};

// Update a user identified by the username in the request
exports.update = (req, res) => {
  // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "user content can not be empty"
        });
    }

    // Find user and update it with the request body
    User.findByIdAndUpdate(req.params.username, {
        blockchainId:req.body.blockchainId
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "user not found with id " + req.params.username
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "user not found with id " + req.params.username
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.username
        });
    });
};

exports.createSupplyChainUsers = (req, res) => {
    truffle_connect.createSupplyChainUsers(req.body.userName, req.body.userAccount, req.body.userType ,req.body.user,(address)=>{
        res.send({
            "status":"success"
        })
    });
}