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
exports.getBatchesInfoForUser = async (req, res) => {
	if(!req.body.user) {
        return res.status(400).send({
            message: "username can not be empty"
        });
    }
    UsersBatchInteraction.findOne({username:req.body.user})
    .then(async userBatch => {
		if(!userBatch){
			return res.status(404).send({
				status: "failure",
                message: "user not found with id " + req.params.username
            });
		}
		var length = userBatch.batchids.length;
		var result=[];
		for(var i=0;i<userBatch.batchids.length;i++){
			 var data =  await truffle_connect.getMedicineData(userBatch.batchids[i],req.body.user);
			 if(data){
				 result.push(data)
			 }
		}
		res.send(result);;
		
	}).catch(err => {
        res.status(500).send({
        	status: "failure",
            message: err.message || "Some error occurred while adding batch to the user."
        });
    });
};