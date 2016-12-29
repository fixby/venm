'use strict';
const User = require("../model/modelUser");
const Util = require("../util/util");
exports.list = function(req, res, next) {
    // console.log(req.method + ' /user => list, query: ' + JSON.stringify(req.query));
    User.getAll(function(err, users) {
        if (err)
            res.json(Util.status(-1, "error"));
        // console.log(users);
        res.json(Util.status(1, "Success", users));
    });
};

exports.new = function(req, res, next) {
    console.log(req.method + ' /user/new => new, query: ' + JSON.stringify(req.query));
    res.json(Util.status(1, "Success", {
        "_action": "new"
    }));
};


exports.show = function(req, res, next) {
    // console.log(req.method + ' /user/:id => show, query: ' + JSON.stringify(req.query) + ', params: ' + JSON.stringify(req.params));
    var id = req.params.id;
    User.getById(id, function(err, user) {
        // console.log(user);
        if (err)
            res.json(Util.status(-1, "error"));
        res.json(Util.status(1, "Success", user))
    });
};

exports.edit = function(req, res, next) {
    // console.log(req.method + ' /user/:id/edit => edit, query: ' + JSON.stringify(req.query) + ', params: ' + JSON.stringify(req.params));
    var id = req.params.id;
    User.getById(id, function(err, user) {
        if (err)
            res.json(Util.status(-1, "error"));
        // console.log(user);
        user._action = 'edit';
        res.json(Util.status(1, "Success", user))
    });
};

exports.create = function(req, res, next) {
    // console.log(req.method + ' /user => create, query: ' + JSON.stringify(req.query) +', params: ' + JSON.stringify(req.params) + ', body: ' + JSON.stringify(req.body));
    User.create(req.body, function(err, user) {
        // console.log(user);
        res.json(Util.status(0, "update success!", user));
    });
};


exports.update = function(req, res, next) {
    // console.log(req.method + ' /user/:id => update, query: ' + JSON.stringify(req.query) + ', params: ' + JSON.stringify(req.params) + ', body: ' + JSON.stringify(req.body));
    var id = req.params.id;
    User.updateById(id, req.body, function(err, user) {
        // console.log(user);
        res.json(Util.status(0, "update success!", {
            redirect: '/user/' + id
        }));
    });
};

exports.destroy = function(req, res, next) {
    // console.log(req.method + ' /user/:id => destroy, query: ' + JSON.stringify(req.query) + ', params: ' + JSON.stringify(req.params) + ', body: ' + JSON.stringify(req.body));
    var id = req.params.id;
    User.deleteById(id, function(err) {
        // console.log(err);
        res.json(Util.status(0, "delete success!"));
    })
};