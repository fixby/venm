'use strict';
global.Promise = require('bluebird');
const Util = require('../util/util');
const ejs = require('ejs');
const fs = Promise.promisifyAll(require('fs'));

/**
 * 获取指定的所有字段
 */

// 开始函数
Promise.coroutine(function*() {
    // 获取命令行
    const module = process.argv[2];
    const Module = Util.firstLetterUpper(module);

    // 读取路由模板
    let tmprouter = yield fs.readFileAsync('./server/generate/tempRouter.ejs');
    // 编译模板
    tmprouter = ejs.render(tmprouter.toString(), { module, Module });
    // 写入模板
    yield fs.writeFileAsync('./server/router/'.concat(module, '.js'), tmprouter);
    console.log('路由文件创建成功!');

    // 读取服务模板
    let tmpservice = yield fs.readFileAsync('./server/generate/tempService.ejs');
    // 编译模板
    tmpservice = ejs.render(tmpservice.toString(), { module, Module });
    // 写入模板
    yield fs.writeFileAsync('./server/service/service'.concat(Module, '.js'), tmpservice);
    console.log('服务文件创建成功!');

    // 读取模型模板
    let tmpmodel = yield fs.readFileAsync('./server/generate/tempmodel.ejs');
    // 编译模板
    tmpmodel = ejs.render(tmpmodel.toString(), { module, Module });
    // 写入模板
    yield fs.writeFileAsync('./server/model/model'.concat(Module, '.js'), tmpmodel);
    console.log('模型文件创建成功!');

    // 读取测试模板
    let tmptest = yield fs.readFileAsync('./server/generate/temp.test.ejs');
    // 编译模板
    tmptest = ejs.render(tmptest.toString(), { module, Module });
    // 写入模板
    yield fs.writeFileAsync('./server/test/'.concat(module, '.test.js'), tmptest);
    console.log('创建测试文件成功!');

    process.exit(0);
})().catch((err) => {
    console.log(err.stack);
}).finally(() => {});