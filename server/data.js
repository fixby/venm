/**
 * 随机生成N多文章
 */
const express = require('express');
const loremipsum = require('lorem-ipsum');
const slug = require('slug');
const router = express.Router();
const db = require('./db');
const app = express();
app.get("/", function(err, res, next) {
    db.User.findOne(function(err, user) {
        if (err) return console.log('cannot find user');

        db.Category.find(function(err, categories) {
            if (err) return console.log('cannot find categories');

            categories.forEach(function(category) {
                for (let i = 0; i < 35; i++) {
                    let title = loremipsum({ count: 1, units: 'sentence', sentenceLowerBound: 5, sentenceUpperBound: 15, random: Math.random });
                    let content = loremipsum({ count: 3, units: 'paragraphs', paragraphLowerBound: 3, paragraphUpperBound: 7, random: Math.random });
                    let article = new db.Article({
                        title: title,
                        content: content,
                        author: user,
                        category: category,
                        created: new Date,
                        slug: slug(title),
                        published: true,
                        meta: { favorites: 0 },
                        comments: []
                    });

                    article.save(function(err, article) {
                        console.log('save article: ', article.slug);
                    });
                }
            });
        })

    })
    res.send("finished");
});

app.set('port', (process.env.port || 3300));
app.listen(app.get('port'), function() {
    console.log('Server up: http://localhost:' + app.get('port'));
});