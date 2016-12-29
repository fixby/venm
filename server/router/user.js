var express = require('express');
var router = express.Router();
var $ = require('../service/serviceUser');
// -- custom
/**
 * Auto generate RESTful url routes.
 *
 * URL routes:
 *
 *  GET    /user[/]        => $.list()
 *  GET    /user/new       => $.new()
 *  GET    /user/:id       => $.show()
 *  GET    /user/edit/:id  => $.edit()
 *  POST   /user[/]        => $.create()
 *  PATCH  /user/:id       => $.update()
 *  DELETE /user/:id       => $.destroy()
 *
 */

router.get('/new', $.new);
router.get('/edit/:id', $.edit);

router.route('/')
    .get($.list)
    .post($.create);

router.route('/:id')
    .patch($.update)
    .get($.show)
    .delete($.destroy);
module.exports = router;