const express = require('express');
const mongoose = require('mongoose');
const slug = require('slug');
const pinyin = require("pinyin");
const md5 = require("md5");
const passport = require('passport');
const router = express.Router();
const db = require('./model');


/**
 * Service implacement
 * 接口符合RESTful风格
 */

let n = 0; //for trace output
/**
 * 前台 查全部文章
 * sort by created
 * inflated the article's ref (author and category)
 * return data to the front
 * query by category and author
 * slice the pages : curPage-current page; pageSize-count pre page; pageCount-total pages
 *
 * type:get
 * Parameters: /articel?page=n
 * Response:{
 *      result:[{Article}],
        pageCount:n,
        curPage:n,
 * }
 */
router.get('/article', function(req, res, next) {
    const keyword = req.query.keyword;
    const conditions = { published: true };
    if (keyword) {
        conditions.title = new RegExp(keyword.trim(), 'i');
        conditions.content = new RegExp(keyword.trim(), 'i');
    }
    db.Article.find(conditions)
        .sort('-created')
        .populate('author')
        .populate('category')
        .exec(function(err, result) {
            console.log('get article list ' + n++, 'cur page: ' + JSON.stringify(req.query));

            if (err) throw next(err);
            let curPage = Math.abs(parseInt(req.query.page || 1, 10));
            let pageSize = 10;
            let totalCount = result.length;
            let pageCount = Math.ceil(totalCount / pageSize);

            if (curPage > pageCount) curPage = pageCount;

            let back = {
                result: result.slice((curPage - 1) * pageSize, curPage * pageSize),
                pageCount: pageCount,
                curPage: curPage,
                pretty: true
            };
            res.status(200).send(back).end();
        });
});

/**
 * 前台查一个文章
 * type:get
 * Parameters: /articel/id || /article/slug
 * Response:{Article}
 */
router.get('/article/:id', function(req, res, next) {
    if (!req.params.id) {
        return next(new Error('未提供查询字段'));
    }

    let conditions = {}; //转换成slug链接 方便SEO
    try {
        conditions._id = mongoose.Types.ObjectId(req.params.id);
    } catch (err) {
        conditions.slug = req.params.id;
    }

    db.Article.findOne(conditions)
        .populate('author')
        .populate('category')
        .exec(function(err, result) {
            console.log('get article ' + n++, 'params: ' + JSON.stringify(req.params));

            if (err) throw err;
            res.status(200).send(JSON.stringify(result)).end();
        });
});

/**
 * 前台点赞一篇文章
 * type:get
 * Parameters: /favorite/id  || /favorite/slug
 * Response:None
 */
router.get('/favorite/:id', function(req, res, next) {
    if (!req.params.id) {
        return next(new Error('未提供操作条目'));
    }

    let conditions = {};
    try {
        conditions._id = mongoose.Types.ObjectId(req.params.id);
    } catch (err) {
        conditions.slug = req.params.id;
    }

    db.Article.findOne(conditions)
        .populate('author')
        .populate('category')
        .exec(function(err, result) {
            console.log('get article dianzan ' + n++, 'params: ' + JSON.stringify(req.params));

            if (err) throw err;

            result.meta.favorites = result.meta.favorites ? result.meta.favorites + 1 : 1;
            result.markModified('meta');
            result.save(function(err) {
                if (err) throw err;
                console.log('add article dianzan ' + n++);
                res.status(200).redirect('/userArticle/?id=' + result.slug);
            });
        });
});

/**
 * 前台评论一篇文章
 * type:post
 * Parameters: /comment/id  || /comment/slug
 * Response:None
 */
router.post('/comment/:id', function(req, res, next) {
    if (!req.params.id) {
        return next(new Error('未提供操作条目'));
    }

    let conditions = {};
    try {
        conditions._id = mongoose.Types.ObjectId(req.params.id);
    } catch (err) {
        conditions.slug = req.params.id;
    }

    db.Article.findOne(conditions).exec(function(err, result) {
        console.log('get article comment ' + n++, 'params: ' + JSON.stringify(req.params));

        if (err) throw err;

        let comment = {
            author: req.body.author,
            content: req.body.content,
            created: new Date
        };

        result.comments.unshift(comment);
        result.markModified('comments');

        result.save(function(err) {
            if (err) throw err;
            console.log('add article comment ' + n++);
            //req.flash('info', '评论添加成功');
            res.redirect('/userArticle/?id=' + result.slug);
        });
    });
});



/**
 * 后台发布文章
 * type:post
 * Parameters: /article
 * Response: {Article}
 */
router.post("/article", requireLogin, function(req, res) {
    //服务端验证字段
    req.checkBody('title', '文章标题不能为空').notEmpty();
    req.checkBody('category', '文章分类不能为空').notEmpty();
    req.checkBody('content', '文章内容不能为空').notEmpty();

    let errors = req.validationErrors();
    if (errors) return res.status(301).send(errors).end();

    var title = req.body.title.trim();
    var category = req.body.category.trim();
    var content = req.body.content;

    db.User.findOne({}, function(err, user) {
        if (err) throw err;

        //汉字转拼音
        let py = pinyin(title, {
            style: pinyin.STYLE_NORMAL,
            heteronym: false
        }).map(function(item) {
            return item[0];
        }).join(' ');

        let getOjb = {
            title: title,
            slug: slug(py),
            content: content,
            category: category,
            author: user,
            created: new Date,
            meta: { favorites: 0 },
            comments: [],
            published: true
        };
        console.log(JSON.stringify(getOjb));
        let article = new db.Article(getOjb);

        article.save(function(err, result) {
            if (err) {
                console.log('add article err:' + err);
                throw err;
            } else {
                console.log('add article err:' + err);
                console.log('add article 文章保存成功' + n++);
                //res.redirect('/adminArticleList');
                res.status(200).send(JSON.stringify(result)).end();
            }

        });
    })
});

/**
 * 后台修改文章时先查一个文章
 * type:get
 * Parameters: /edit/:id
 * Response:{Article}
 */
router.get('/edit/:id', requireLogin, getAritcleById, function(req, res, next) {
    console.log('get article ' + n++, 'params: ' + JSON.stringify(req.params));
    res.status(200).send(JSON.stringify(req.result)).end();
});

/**
 * 后台修改文章
 * type:put
 * Parameters: /article/:id
 * Response:{Article}
 */
router.put("/article/:id", requireLogin, getAritcleById, function(req, res, next) {
    console.log('modify article ' + n++, 'params: ' + JSON.stringify(req.params));
    const article = req.result;
    const title = req.body.title.trim();
    const category = req.body.category.trim();
    const content = req.body.content;

    //服务端验证字段
    req.checkBody('title', '文章标题不能为空').notEmpty();
    req.checkBody('category', '文章分类不能为空').notEmpty();
    req.checkBody('content', '文章内容不能为空').notEmpty();

    let errors = req.validationErrors();
    if (errors) return res.status(301).send(errors).end();

    //汉字转拼音
    let py = pinyin(title, {
        style: pinyin.STYLE_NORMAL,
        heteronym: false
    }).map(function(item) {
        return item[0];
    }).join(' ');

    article.title = title;
    article.slug = slug(py);
    article.content = content;
    article.category = category;
    article.created = new Date;

    article.save(function(err, result) {
        if (err) {
            console.log('edit article err:' + err);
            throw err;
        } else {
            console.log('edit article err:' + err);
            console.log('edit article 文章修改成功' + n++);
            //res.redirect('/adminArticleList');
            res.status(200).send(JSON.stringify(result)).end();
        }
    });
});

/**
 * 后台删除文章
 * type:delect
 * Parameters: /article/:id
 * Response:None
 */
router.delete("/article/:id", requireLogin, function(req, res) {
    db.Article.findOneAndRemove({ _id: req.params.id }, function(err, result) {
        console.log('delete article ' + n++, 'params: ' + JSON.stringify(req.params));

        if (err) throw err;
        //if(result) req.flash('success', '文章删除成功');
        res.status(200).send(JSON.stringify(result)).end();
        //res.status(200).redirect('/adminArticleList');
    });
});



/**
 * 前后台查全部分类
 * Parameters: /category?page=n
 * Response:{
 *      result:[{Article}],
        pageCount:n,
        curPage:n,
 * }
 */
router.get('/category', function(req, res, next) {
    console.log('get category list ' + n++);
    db.Category.find({})
        .sort('-created')
        .exec(function(err, result) {
            if (err) throw next(err);

            res.status(200).send(result).end();
        });
});




/**
 * 后台添加分类
 * type:post
 * Parameters: /category
 * Response: {Category}
 */
router.post("/category", requireLogin, function(req, res) {
    //服务端验证字段
    req.checkBody('name', '分类名称不能为空').notEmpty();

    let errors = req.validationErrors();
    if (errors) return res.status(301).send(errors).end();

    var name = req.body.name.trim();

    db.User.findOne({}, function(err, user) {
        if (err) throw err;

        //汉字转拼音
        let py = pinyin(name, {
            style: pinyin.STYLE_NORMAL,
            heteronym: false
        }).map(function(item) {
            return item[0];
        }).join(' ');

        let getOjb = {
            name: name,
            slug: slug(py),
            author: user,
            created: new Date,
        };
        console.log(JSON.stringify(getOjb));
        let category = new db.Category(getOjb);

        category.save(function(err, result) {
            if (err) {
                console.log('add category err:' + err);
                throw err;
            } else {
                console.log('add category 分类保存成功' + n++);
                res.status(200).send(JSON.stringify(result)).end();
            }
        });
    })
});


/**
 * 后台修改分类时先查询分类
 * type:get
 * Parameters: /edit/:id
 * Response:{Article}
 */
router.get('/category/edit/:id', requireLogin, getCategoryById, function(req, res, next) {
    console.log('get category ' + n++, 'params: ' + JSON.stringify(req.params));
    res.status(200).send(JSON.stringify(req.result)).end();
});

/**
 * 后台修改分类
 * type:put
 * Parameters: /article/:id
 * Response:{Article}
 */
router.put("/category/:id", requireLogin, getCategoryById, function(req, res, next) {
    console.log('modify category ' + n++, 'params: ' + JSON.stringify(req.params));
    const category = req.result;
    const name = req.body.name.trim();

    //服务端验证字段
    req.checkBody('name', '分类名称不能为空').notEmpty();

    let errors = req.validationErrors();
    if (errors) return res.status(301).send(errors).end();

    //汉字转拼音
    let py = pinyin(name, {
        style: pinyin.STYLE_NORMAL,
        heteronym: false
    }).map(function(item) {
        return item[0];
    }).join(' ');

    category.name = name;
    category.slug = slug(py);
    category.created = new Date;

    category.save(function(err, result) {
        if (err) {
            console.log('edit category err:' + err);
            throw err;
        } else {
            console.log('edit category err:' + err);
            console.log('edit category 分类修改成功' + n++);
            res.status(200).send(JSON.stringify(result)).end();
        }
    });
});


/**
 * 前后台查全部作者
 * Parameters: /user
 * Response:[{User}]
 * }
 */
router.get('/user', function(req, res, next) {
    console.log('get author list ' + n++);
    db.User.find({})
        .sort('created')
        .exec(function(err, result) {
            if (err) throw next(err);

            res.status(200).send(result).end();
        });
});

/**
 * 前后台查单个分类的文章聚合
 *
 */
router.get('/category/:id', function(req, res, next) {
    //res.jsonp(req.params);
    db.Category.findOne({ _id: req.params.id }).exec(function(err, category) {
        console.log('get category all articles ' + n++, 'params: ' + JSON.stringify(req.params));

        if (err) throw next(err);

        db.Article.find({ category: category, published: true })
            .sort('created')
            .populate('author')
            .populate('category')
            .exec(function(err, articles) {
                if (err) throw next(err);

                res.status(200).send(articles).end();
            })
    });
});



/**
 * 后台 查全部文章
 * sort by created
 * inflated the article's ref (author and category)
 * return data to the frontEnd
 * query by category and author
 * slice the pages : curPage-current page; pageSize-count pre page; pageCount-total pages
 * sort by 5 type
 * fliter by category and author
 * type:get
 * Parameters: /articel?queries
 * Response:{
 *      result:[{Article}],
        pageCount:n,
        curPage:n,
 * }
 * Default value:
 * page:1
 * sortby:title
 * sortdir:asc
 * categoryId:undefined
 * userId:undefined
 */
router.get('/admin/article', requireLogin, function(req, res, next) {
    //sort
    let sortby = req.query.sortby ? req.query.sortby : 'created';
    let sortdir = req.query.sortdir ? req.query.sortdir : 'desc';

    if (['title', 'category', 'author', 'created', 'published'].indexOf(sortby) === -1) {
        sortby = 'created';
    }
    if (['desc', 'asc'].indexOf(sortdir) === -1) {
        sortdir = 'desc';
    }

    let sortObj = {};
    sortObj[sortby] = sortdir;

    //condition
    let conditions = {};
    if (req.query.categoryId) {
        conditions.category = req.query.categoryId.trim();
    }
    if (req.query.userId) {
        conditions.author = req.query.userId.trim();
    }
    if (req.query.keyword) {
        conditions.title = new RegExp(req.query.keyword.trim(), 'i');
        conditions.content = new RegExp(req.query.keyword.trim(), 'i');
    }
    conditions.published = true;

    db.User.find({}, function(err, users) { //查询每个user发布的文章
        if (err) throw next(err);

        db.Article.find(conditions)
            .sort(sortObj)
            .populate('author')
            .populate('category')
            .exec(function(err, articles) {
                console.log('get article list ' + n++, 'query: ' + JSON.stringify(req.query));

                if (err) throw next(err);
                let curPage = Math.abs(parseInt(req.query.page || 1, 10));
                let pageSize = 10;
                let totalCount = articles.length;
                let pageCount = Math.ceil(totalCount / pageSize);

                if (curPage > pageCount) curPage = pageCount;

                let back = {
                    result: articles.slice((curPage - 1) * pageSize, curPage * pageSize),
                    pageCount: pageCount,
                    curPage: curPage,
                    sortby: sortby,
                    //author:author,
                    pretty: true
                };
                res.status(200).send(back).end();
            });
    });
});

/**
 * Middleware 通过ID查找文章
 */
function getAritcleById(req, res, next) {
    let id = req.params.id;
    if (!id) {
        return next(new Error('未提供查询字段'));
    }

    db.Article.findOne({ _id: id })
        .populate('author')
        .populate('category')
        .exec(function(err, result) {
            if (err) {
                throw err;
            }
            if (!result) {
                return next(new Error('article not found: ', id));
            }
            req.result = result;
            next();
        });
}


/**
 * Middleware 通过ID查找分类
 */
function getCategoryById(req, res, next) {
    let id = req.params.id;
    if (!id) {
        return next(new Error('未提供查询字段'));
    }

    db.Category.findOne({ _id: id }).exec(function(err, result) {
        if (err) {
            console.log('get category: ' + err);
            throw err;
        }
        if (!result) {
            return next(new Error('article not found: ', id));
        }
        req.result = result;
        next();
    });
}

/**
 * 登录
 * 使用passport模块
 */
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: '用户名或密码错误'
}), function(req, res, next) {
    res.status(200).send(JSON.stringify(req.body));
    console.log('user login success: ' + JSON.stringify(req.body));
});

/**
 * 注册
 */
router.post('/reg', function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const comfirmPassword = req.body.comfirmPassword;

    console.log('email: ' + email, 'pass: ' + password, 'repass:' + comfirmPassword);

    //服务端验证字段
    req.checkBody('email', '须为邮箱且不能为空').notEmpty().isEmail();
    req.checkBody('password', '密码不能为空').notEmpty();
    req.checkBody('comfirmPassword', '重复密码不能为空且两次密码须一致').notEmpty().equals(password);

    let errors = req.validationErrors();
    console.log(errors);
    if (errors) return res.status(301).send(errors).end();

    const user = new db.User({
        name: email.split('@').shift(),
        email: email,
        password: md5(password),
        created: new Date
    });

    user.save(function(err, result) {
        if (err) {
            console.log('reg err:' + err);
            throw err;
        } else {
            console.log('用户注册成功info: ' + n++);
            //res.redirect('/adminArticleList');
            res.status(200).send(JSON.stringify(result)).end();
        }
    });
});

/**
 * 修改密码
 */
router.post('/password', function(req, res, next) {
    const password = req.body.password.trim();
    const comfirmPassword = req.body.comfirmPassword.trim();
    const getUser = req.body.user;

    console.log('newPwd: ' + password, 'comfirmPassword: ' + comfirmPassword, 'id:' + getUser._id);

    //服务端验证字段
    req.checkBody('password', '密码不能为空').notEmpty();
    req.checkBody('comfirmPassword', '重复密码不能为空且两次密码须一致').notEmpty().equals(password);

    let errors = req.validationErrors();
    console.log(errors);
    if (errors) return res.status(301).send(errors).end();

    db.User.findOne({ _id: getUser._id }).exec(function(err, user) {
        user.password = md5(password);

        user.save(function(err, result) {
            if (err) {
                console.log('modify pwd err:' + err);
                throw err;
            } else {
                console.log('修改密码成功info: ' + n++);
                res.status(200).send(JSON.stringify(result)).end();
            }
        });
    });
});


/**
 * 获取登录信息session
 */
router.get('/mysession', requireLogin, function(req, res, next) {
    console.log('call mysession: ' + n++);
    let user = req.user;
    res.status(200).send(user).end();
});

/**
 * 注销
 */
router.get('/logout', function(req, res, next) {
    req.logout();
    res.status(200).send(user).end();
});

/**
 * Middleware 用户权限校验
 */
function requireLogin(req, res, next) {
    if (req.user) {
        next();
    } else {
        next(new Error('登录用户才能访问'));
    }
}

module.exports = router;