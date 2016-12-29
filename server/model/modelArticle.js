const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const MongooseDao = require('../base/dao');
const Schema = mongoose.Schema;
const ModelArticle = new Schema({
    title: { type: String, require: true },
    content: { type: String, require: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    created: { type: Date },
    slug: { type: String, required: true },
    published: { type: Boolean, default: false },
    meta: { type: Schema.Types.Mixed },
    comments: [Schema.Types.Mixed]
}, { versionKey: false });
const Article = new MongooseDao(mongoose.model('Article', ModelArticle));
module.exports = Article;