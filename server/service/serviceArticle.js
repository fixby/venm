'use strict';
const Article = require("../model/modelArticle");
const Util = require("../util/util");
exports.list = function(req, res, next) {
    // console.log(req.method + ' /article => list, query: ' + JSON.stringify(req.query));
    const conditions = req.query;
    let curPage = Math.abs(parseInt(req.query.page || 1, 10)) || 1;
    delete conditions.page;
    let pageSize = Util.pageSize;
    if (conditions.keyword) {
        conditions.title = new RegExp(conditions.keyword.trim(), 'i');
        conditions.content = new RegExp(conditions.keyword.trim(), 'i');
        delete req.query.keyword;
    }
    if (conditions.title) {
        conditions.title = new RegExp(conditions.keyword.trim(), 'i');
    }
    if (conditions.content) {
        conditions.content = new RegExp(conditions.keyword.trim(), 'i');
    }

    Article.getAll(conditions)
        // .sort('-created')
        .populate('author')
        .populate('category')
        .exec(function(err, articles) {
            if (err) {
                res.json(Util.status(-1, "error"));
                return;
            }
            // console.log(articles);
            let totalCount = articles.length;
            let pageCount = Math.ceil(totalCount / pageSize);
            if (curPage > pageCount) curPage = pageCount;
            articles = articles.slice((curPage - 1) * pageSize, curPage * pageSize);
            res.json(Util.status(1, "Success", articles));
        });
};

exports.new = function(req, res, next) {
    // console.log(req.method + ' /article/new => new, query: ' + JSON.stringify(req.query));
    res.json(Util.status(1, "Success", {
        "_action": "new"
    }));
};


exports.show = function(req, res, next) {
    // console.log(req.method + ' /article/:id => show, query: ' + JSON.stringify(req.query) + ', params: ' + JSON.stringify(req.params));
    var id = req.params.id;
    Article.getById(id, function(err, article) {
        // console.log(article);
        if (err) {
            res.json(Util.status(-1, "error"));
            return;
        }
        res.json(Util.status(1, "Success", article))
    });
};

exports.edit = function(req, res, next) {
    // console.log(req.method + ' /article/:id/edit => edit, query: ' + JSON.stringify(req.query) + ', params: ' + JSON.stringify(req.params));
    var id = req.params.id;
    Article.getById(id)
        .populate('author')
        .populate('category')
        .exec(function(err, article) {
            if (err) {
                res.json(Util.status(-1, err));
                return;
            }
            console.log(article);
            article._action = 'edit';
            res.json(Util.status(1, "Success", article))
        });
};

exports.create = function(req, res, next) {
    // console.log(req.method + ' /article => create, query: ' + JSON.stringify(req.query) +', params: ' + JSON.stringify(req.params) + ', body: ' + JSON.stringify(req.body));
    Article.create(req.body, function(err, article) {
        // console.log(article);
        res.json(Util.status(0, "create success!", article));
    });
};


exports.update = function(req, res, next) {
    // console.log(req.method + ' /article/:id => update, query: ' + JSON.stringify(req.query) + ', params: ' + JSON.stringify(req.params) + ', body: ' + JSON.stringify(req.body));
    var id = req.params.id;
    Article.updateById(id, req.body, function(err, article) {
        // console.log(article);
        res.json(Util.status(0, "update success!", {
            redirect: '/article/' + id
        }));
    });
};

exports.destroy = function(req, res, next) {
    // console.log(req.method + ' /article/:id => destroy, query: ' + JSON.stringify(req.query) + ', params: ' + JSON.stringify(req.params) + ', body: ' + JSON.stringify(req.body));
    var id = req.params.id;
    Article.deleteById(id, function(err) {
        // console.log(err);
        res.json(Util.status(0, "delete success!"));
    })
};