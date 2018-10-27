const FakeMedicine = require('../models/fake.medicine.model.js');

exports.create = (batchId, username, action) => {
        
    const fakeMedicine = new FakeMedicine({
        batchId:batchId,
        username:username,
        action:action
    });
    
    fakeMedicine.save()
    .then(data => {
        return {status:"success"}
    }).catch(err => {
        return {
        	status:"failure",
            message: err.message || "Some error occurred while creating the fake medicine record."
        }
    });
   
};

exports.getAllFakeMedicineRecords = (req,res) => {
    
    fakeMedicine.find({},{"_id":0})
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while getting fake medicine recors."
        });
    });
   
};