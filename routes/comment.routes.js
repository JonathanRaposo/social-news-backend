const express = require('express');
const Article = require('../models/Article.model');
const router = express.Router();

const Comment = require('../models/Comment.model');
const User = require('../models/User.model');

const { isAuthenticated } = require('../middleware/jwt.middleware');


router.post('/api/articles/:articleId/comment', isAuthenticated, (req, res, next) => {
    console.log("body from the comment form: ", req.body)
    console.log('parameters from comment form: ', req.params)

    const { articleId } = req.params;
    const { author, content, article } = req.body;

    console.log('author: ', author)

    Comment.create({ author, content, article })

        .then((dbcomment) => {
            console.log("this is the new comment: ", dbcomment)
            return Article.findByIdAndUpdate(articleId, { $push: { comments: dbcomment._id } })
        })
        .then((updatedArticle) => {
            res.json(updatedArticle)
        })


})







module.exports = router;