const mongoose = require('../database/mongoose')
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    }, 
    createAt: {
        type: Date,
        default: Date.now,
    }
})

UserSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();
    
    bcrypt.genSalt(10, function(err, salt) {        
        if (err) return next(err);
                
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);            
            user.password = hash;
            next();
        });
    });
});


const User = mongoose.model('User', UserSchema)
module.exports = User