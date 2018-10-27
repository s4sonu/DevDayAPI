const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: 'Username already exists',
        required: 'Please fill in a username',
        lowercase: true,
        trim: true
    },
    approved:{
        type:Boolean
    }
    password: {
        type: String,
        required: 'Please fill in a password'
    },
    usertype:{
    	type: String,
    	required: 'Please fill in a usertype',
    },
    blockchainId:{
    	type:String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Users', UserSchema);
