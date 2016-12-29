const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const MongooseDao = require('../base/dao');
const Schema = mongoose.Schema;

const ModelCategory = new Schema({
    name: { type: String, require: true },
    slug: { type: String, require: true },
    created: { type: Date }
});
const Category = new MongooseDao(mongoose.model('Category', ModelCategory));
module.exports = Category;