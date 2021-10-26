const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose); // 'plugging in' the passportLocalMongoose into the schema, adds-on fields like 'username' and 'password' 

module.exports = mongoose.model('User', UserSchema);