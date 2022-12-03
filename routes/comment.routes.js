const express = require('express');
const Article = require('../models/Article.model');
const router = express.Router();

const Comment = require('../models/Comment.model');
const User = require('../models/User.model');

const { isAuthenticated } = require('../middleware/jwt.middleware');


router.post('/api/articles/:articleId/comment', isAuthenticated, (req, res, next) => {
    console.log("body from comment form: ", req.body)
    console.log('parameters from comment form: ', req.params)

    const { articleId } = req.params;
    const { user, content, article } = req.body;

    let theUser;

    User.findOne({ _id: user })
        .then((userFromDB) => {
            console.log('user from database: ', user)

            theUser = userFromDB;

            if (!userFromDB) {
                return User.create({ _id: user });
            }
        })
        .then((newUser) => {

            Article.findById(articleId)
                .populate('user')
                .then((articleFromDB) => {
                    console.log('this is the article from the database: ', articleFromDB);

                    let newComment;

                    if (newUser) {
                        newComment = new Comment({ _id: newUser._id, content });
                    }
                    else {
                        newComment = new Comment({ _id: user._id, content });
                    }

                    newComment.save()
                        .then((commentFromDB) => {
                            articleFromDB.comments.push(commentFromDB._id);
                            articleFromDB.save()
                                .then((updatedArticle) => {
                                    res.json(updatedArticle)
                                })
                        })
                })
                .catch((error) => {
                    res.json(error)
                })
        })

})



module.exports = router;