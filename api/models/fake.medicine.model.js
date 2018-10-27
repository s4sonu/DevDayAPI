const mongoose = require('mongoose');

const FakeMedicine = mongoose.Schema({
    batchId: {
        type: String
    },
    username: {
        type: String
    },
    action:{
        type:String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FakeMedicine', FakeMedicine);