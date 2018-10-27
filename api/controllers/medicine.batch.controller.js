const truffle_connect = require('../../connection/app.js');
const User = require('../models/batchid.history.model.js');
exports.create = (req, res) => {
	truffle_connect.createBatch(req.body._batchId,req.body._noOfMedicines,req.body._manufacturedDate,req.body._createdDate,req.body._expirydate,req.body._location,req.body._sourceCountry, req.body._destinationCountry,(transaction)=>{

	});
};

exports.recieve = (req, res) => {
	truffle_connect.updateBatchStatusToReceived(req.body._batchId, req.body._destinationCountry ,req.sender,(transaction)=>{

	});
};

exports.dispatch = (req, res) => {
	truffle_connect.updateBatchStatusToDispatched(req.body._batchId, req.body._destinationCountry,req.sender,(transaction)=>{

	});
};
exports.findByBatchId = (req, res) => {
	truffle_connect.getBatch(req.params._batchId,req.sender,(transaction)=>{

	});
};