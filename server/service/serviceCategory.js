'use strict';
const Category = require("../model/modelCategory");
const Util = require("../util/util");
exports.list = function(req, res, next) {
    // console.log(req.method + ' /category => list, query: ' + JSON.stringify(req.query));
    Category.getAll(function(err, categorys) {
        if (err)
            res.json(Util.status(-1, "error"));
        // console.log(categorys);
        res.json(Util.status(1, "Success", categorys));
    });
};

exports.new = function(req, res, next) {
    console.log(req.method + ' /category/new => new, query: ' + JSON.stringify(req.query));
    res.json(Util.status(1, "Success", {
        "_action": "new"
    }));
};


exports.show = function(req, res, next) {
    // console.log(req.method + ' /category/:id => show, query: ' + JSON.stringify(req.query) + ', params: ' + JSON.stringify(req.params));
    var id = req.params.id;
    Category.getById(id, function(err, category) {
        // console.log(category);
        if (err)
            res.json(Util.status(-1, "error"));
        res.json(Util.status(1, "Success", category))
    });
};

exports.edit = function(req, res, next) {
    // console.log(req.method + ' /category/:id/edit => edit, query: ' + JSON.stringify(req.query) + ', params: ' + JSON.stringify(req.params));
    var id = req.params.id;
    Category.getById(id, function(err, category) {
        if (err)
            res.json(Util.status(-1, "error"));
        // console.log(category);
        category._action = 'edit';
        res.json(Util.status(1, "Success", category))
    });
};

exports.create = function(req, res, next) {
    // console.log(req.method + ' /category => create, query: ' + JSON.stringify(req.query) +', params: ' + JSON.stringify(req.params) + ', body: ' + JSON.stringify(req.body));
    Category.create(req.body, function(err, category) {
        // console.log(category);
        res.json(Util.status(0, "update success!", category));
    });
};


exports.update = function(req, res, next) {
    // console.log(req.method + ' /category/:id => update, query: ' + JSON.stringify(req.query) + ', params: ' + JSON.stringify(req.params) + ', body: ' + JSON.stringify(req.body));
    var id = req.params.id;
    ModelCategory.updateById(id, req.body, function(err, category) {
        // console.log(category);
        res.json(Util.status(0, "update success!", {
            redirect: '/category/' + id
        }));
    });
};

exports.destroy = function(req, res, next) {
    // console.log(req.method + ' /category/:id => destroy, query: ' + JSON.stringify(req.query) + ', params: ' + JSON.stringify(req.params) + ', body: ' + JSON.stringify(req.body));
    var id = req.params.id;
    ModelCategory.deleteById(id, function(err) {
        // console.log(err);
        res.json(Util.status(0, "delete success!"));
    })
};