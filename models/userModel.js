import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

let userModel = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type:String,
        required: true
    }
});

userModel.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

// checking if a password is valid
userModel.methods.comparePassword = function (password, cb) {
    console.log("inside bcrypt.comparePassword() password", password)
    bcrypt.compare(password, this.password, function (err, isMatch) {
        console.log("inside bcrypt.compare()  isMatch", isMatch)
        if (err) {
            console.log("inside bcrypt.compare() error being sent back!!!!", err);
            return cb(err);
        }
        cb(null, isMatch);
    });
};



module.exports = mongoose.model('User', userModel);