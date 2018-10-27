const UsersBatchInteraction = require('../models/user.batch.interaction.model.js');
const truffle_connect = require('../../connection/app.js');
exports.addBatchToUser = (username, batchid) => {

	UsersBatchInteraction.updateOne(
		{username:username},
		{$push:{batchids:batchid}},
		{upsert:true}
	).then(userBatch => {
		if(!userBatch){
			return {
				status: "failure",
				message: "user not found with id " + req.params.username
			};
		}
		return {status: "success"}
	}).catch(err => {
        return {message: err.message || "Some error occurred while adding batch to the user."}
    });
};

exports.removeBatchFromUser = (username, batchid) => {
	
	UsersBatchInteraction.updateOne(
		{username:username},
		{$pull:{batchids:batchid}}
	).then(userBatch => {
		if(!userBatch){
			return {
				status: "failure",
				message: "user not found with id " + req.params.username
			};
		}
		return {status: "success"}
	}).catch(err => {
        return {message: err.message || "Some error occurred while adding batch to the user."}
    });
};
exports.getBatchesInfoForUser = (req, res) => {
	if(!req.body.username) {
        return res.status(400).send({
            message: "username can not be empty"
        });
    }
    UsersBatchInteraction.findOne({username:req.body.username})
    .then(userBatch => {
		if(!user){
			return res.status(404).send({
				status: "failure",
                message: "user not found with id " + req.params.username
            });
		}
		var result=[];
		for(var i=0;i<userBatch.batchids;i++){
		 	await truffle_connect.getBatch(userBatch.batchids[i],req.body.username,(batchInfo)=>{
					result.push(batchInfo);
				});
		}
		res.send({username:userBatch.username,batchesInfo:result});
	}).catch(err => {
        res.status(500).send({
        	status: "failure",
            message: err.message || "Some error occurred while adding batch to the user."
        });
    });
};