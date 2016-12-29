var express = require('express');
var router = express.Router();
var $ = require('../service/serviceArticle');
// -- custom
/**
 * Auto generate RESTful url routes.
 *
 * URL routes:
 *
 *  GET    /article[/]        => $.list()
 *  GET    /article/new       => $.new()
 *  GET    /article/:id       => $.show()
 *  GET    /article/edit/:id  => $.edit()
 *  POST   /article[/]        => $.create()
 *  PATCH  /article/:id       => $.update()
 *  DELETE /article/:id       => $.destroy()
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