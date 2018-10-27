const truffle_connect = require('../../connection/app.js');
const BatchidHistory = require('../models/batchid.history.model.js');
const userBatchInteraction = require('../controllers/user.batch.interaction.controllers.js');
exports.create = (req, res) => {
	truffle_connect.createBatch(req.body.batchId,
		req.body.noOfMedicines,
		req.body.manufacturedDate,
		req.body.createdDate,
		req.body.expirydate,
		req.body.location,
		req.body.sourceCountry,
		req.body.destinationCountry,
		req.body.user,
		(transaction)=>{
		userBatchInteraction.addBatchToUser(req.body.user, req.body.batchId);
		const batchidHistory =new BatchidHistory({
			batchId:req.body.batchId,
			transactions:[{id:transaction.tx,action:"create",transactionTime:new Date(),initiater:req.body.user,username:"MedChainAdmin",usertype:0}]
		});
		batchidHistory.save()
	    .then(data => {
	        res.send({
				"status":"success"
			});
	    }).catch(err => {
	        res.status(500).send({
				status:"failure",
	            message: err.message || "Some error occurred while creating the batch history."
	        });
	    });
	});
};

exports.recieve = (req, res) => {
	truffle_connect.updateBatchStatusToReceived(req.body.batchId, 
		req.body.destinationCountry,
		req.body.user,
		(transaction)=>{
		userBatchInteraction.addBatchToUser(req.body.user, req.body.batchId);
		BatchidHistory.updateOne(
			{batchId:req.body.batchId},
			{$push:{transactions:{id:transaction.tx,action:"recieve",transactionTime:new Date(),initiater:req.body.user,username:req.body.username,usertype:req.body.usertype}}}
		).then(data => {
	        res.send({
				"status":"success"
			});
	    }).catch(err => {
	        res.status(500).send({
				status:"failure",
	            message: err.message || "Some error occurred while updating the batch history."
	        });
	    });
	});
};

exports.dispatch = (req, res) => {
	truffle_connect.updateBatchStatusToDispatched(req.body.batchId, 
		req.body.destinationCountry,
		req.body.user,
		(transaction)=>{
		BatchidHistory.updateOne(
			{batchId:req.body.batchId},
			{$push:{transactions:{id:transaction.tx,action:"dispatch",transactionTime:new Date(),initiater:req.body.user,username:req.body.username,usertype:req.body.usertype}}}
		).then(data => {
	        res.send({
				"status":"success"
			});
	    }).catch(err => {
			res.status(500).send({
				status:"failure",
	            message: err.message || "Some error occurred while creating the batch history."
	        });
	    });
	});
};
exports.findByBatchId = (req, res) => {
	truffle_connect.getBatch(req.body.batchId,req.body.user,(batchInfo)=>{
		res.send(batchInfo)
	});
};