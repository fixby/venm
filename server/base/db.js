const mongoose = require('mongoose');
/**
 * 创建数据库名称并连接
 * Connecting to Mongod instance.
 */
const db = {};
db.connect = () => {
    const dbHost = 'mongodb://localhost:27017/nodeblog';
    mongoose.connect(dbHost);
    const db = mongoose.connection;
    db.on('error', function() {
        console.log('Database connection error.');
    });
    db.once('open', function() {
        console.log('The Database has connected.')
    });
}
module.exports = db;