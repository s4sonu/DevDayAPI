const mongoose = require('mongoose');

const BatchIdHistorySchema = mongoose.Schema({
    batchId: {
        type: String,
        unique: 'batchId already exists',
    },
    transactions:{
        type:Array
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BatchIdHistory', BatchIdHistorySchema);