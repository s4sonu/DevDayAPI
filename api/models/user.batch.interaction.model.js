const mongoose = require('mongoose');

const UserBatchInteraction = mongoose.Schema({
    username: {
        type: String,
        unique: 'Username already exists',
    },
    batchids: {
        type: Array
    }
});

module.exports = mongoose.model('UserBatchInteraction', UserBatchInteraction);