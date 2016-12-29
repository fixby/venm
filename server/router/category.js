var express = require('express');
var router = express.Router();
var $ = require('../service/serviceCategory');
// -- custom
/**
 * Auto generate RESTful url routes.
 *
 * URL routes:
 *
 *  GET    /category[/]        => $.list()
 *  GET    /category/new       => $.new()
 *  GET    /category/:id       => $.show()
 *  GET    /category/edit/:id  => $.edit()
 *  POST   /category[/]        => $.create()
 *  PATCH  /category/:id       => $.update()
 *  DELETE /category/:id       => $.destroy()
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