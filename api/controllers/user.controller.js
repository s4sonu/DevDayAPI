const User = require('../models/users.model.js');
const truffle_connect = require('../../connection/app.js');
const BatchidHistory = require('../models/batchid.history.model.js');
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
    }

    truffle_connect.createAccount(req.body.password,(address)=>{
        // Create a User
    const user = new User({
        username:req.body.username,
        password:req.body.password,
        usertype:req.body.usertype,
        blockchainId:address,
        approved:false
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
update = (username, approved) => {

    // Find user and update it
    User.updateOne(username, {
        approved:approved
    }, {upsert:false,new: true})
    .then(user => {
        if(!user) {
            return {
                status:"failure",
                message: "user not found with id " + username
            }
        }
        return{
            status:"success"
        };
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return {
                status:"failure",
                message: "user not found with id " + username
            }                
        }
        return {
            status:"failure",
            message: "user not found with id " + username
        }
    });
};

exports.getAllUsers = (req, res) => {
    User.find({},{"password":0,"_id":0})
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            status:"failure",
            message: "Error fetching users."
        });
    });
};

exports.getTransactionsForBatchId = (req, res) => {
    BatchidHistory.find({batchId:req.body.batchId},{"transactions":1,"_id":0})
    .then(transactions => {
        res.send(transactions);
    }).catch(err => {
        res.status(500).send({
            status:"failure",
            message: "Error fetching transactions."
        });
    });
}
exports.createSupplyChainUsers = (req, res) => {
   
    truffle_connect.createSupplyChainUsers(req.body.userName, req.body.userAddress, req.body.userType,  req.body.user,(address)=>{
        update(req.body.userAddress,true);
        res.send({status:"success",transaction:address});
    });
}