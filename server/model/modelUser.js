const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;
const md5 = require("md5");
const MongooseDao = require('../base/dao');
const ModelUser = new Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    created: { type: Date }
});
//MD5密码和原密码匹配
ModelUser.methods.verifyPassword = function(password) {
    let isMatch = md5(password) === this.password;
    //console.log('UserSchema.methods.verifyPassword: ', password, this.password, isMatch);
    return isMatch;
};
const User = new MongooseDao(mongoose.model('User', ModelUser));
module.exports = User;