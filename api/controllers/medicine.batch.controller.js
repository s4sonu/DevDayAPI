const truffle_connect = require('../../connection/app.js');
const BatchidHistory = require('../models/batchid.history.model.js');
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
		const batchidHistory =new BatchidHistory({
			batchId:req.body.batchId,
			transactions:[{id:transaction.tx,action:"create",transactionTime:new Date(),initiater:req.body.user}]
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
		BatchidHistory.updateOne(
			{batchId:req.body.batchId},
			{$push:{transactions:{id:transaction.tx,action:"recieve",transactionTime:new Date(),initiater:req.body.user}}}
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
			{batchId:req.body._batchId},
			{$push:{transactions:{id:transaction.tx,action:"recieve",transactionTime:new Date(),initiater:req.body.user}}}
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