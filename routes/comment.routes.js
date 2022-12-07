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



    Comment.create({ author, content, article })
        .then((dbcomment) => {
            console.log("this is the new comment: ", dbcomment)
            return Article.findByIdAndUpdate(articleId, { $push: { comments: dbcomment._id } })
        })
        .then((updatedArticle) => {
            res.json(updatedArticle)
        })
    // res.json({ author, content, article })




})
//   User.findOne({ _id: author })
//         .then((userFromDB) => {
//             console.log('user from database: ', userFromDB)

//             user = userFromDB;
//             return Article.findById(articleId);

//         })
//         .then((articleFromDB) => {
//             console.log('this is the article from the database: ', articleFromDB);

//             let newComment;


//             newComment = new Comment({ author: user._id, content, article: articleFromDB._id });


//             newComment.save()
//                 .then((commentFromDB) => {
//                     console.log('this is new comment: ', commentFromDB)
//                     articleFromDB.comments.push(commentFromDB._id);
//                     articleFromDB.save()
//                         .then((updatedArticle) => {
//                             res.json(updatedArticle)
//                         })
//                 })
//         })
//         .catch((error) => {
//             res.json(error)
//         })


module.exports = router;