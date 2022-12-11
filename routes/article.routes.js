const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');



const Article = require('../models/Article.model');
const User = require('../models/User.model');


// import middleware to protect routes
const { isAuthenticated } = require('../middleware/jwt.middleware');

// POST - create article and add it to the user

router.post('/api/articles', isAuthenticated, (req, res, next) => {
    console.log(req.body);

    const { image, url, name, description, user } = req.body;



    Article.findOne({ url: url })

        .then((articlefound) => {
            if (articlefound) {
                return User.findByIdAndUpdate(user, { $push: { articles: articlefound._id } })
            } else {
                // TODO - verify parameter content
                return Article.create({ image, url, name, description, user })
                    .then((newArticle) => {
                        return User.findByIdAndUpdate(user, { $push: { articles: newArticle._id } })
                    })
            }
        })
        .then((response) => {
            console.log('response with updated user: ', response)
            res.json(response);
        })
        .catch((error) => {
            res.json(error)
        });

});

// GET - Retrieve all of the user's articles

router.get('/api/articles', isAuthenticated, (req, res, next) => {
    // let token = isAuthenticated.getToken(req)
    // console.log('auth token: ', token)
    let token = req.headers.authorization.substring(`Bearer `.length)

    console.log('auth token: ', token)
    console.log('1111111: ', jsonwebtoken.decode(token, { complete: true }).payload._id)
    const userId = jsonwebtoken.decode(token, { complete: true }).payload._id;

    User.findById(userId)

        .then((userFromDB) => {
            const articles = userFromDB.articles;
            // const ids = []

            Article.find({ '_id': { $in: articles } })
                .populate('user comments')
                .populate(
                    {
                        path: 'comments',
                        populate: {
                            path: 'author'
                        }
                    }
                )
                .then((allArticles) => {
                    res.json(allArticles);
                })
                .catch((error) => {
                    res.json(error)
                });
        })

});
// Route to sort articles in descending order
router.get('/api/articles/sort/descending', isAuthenticated, (req, res, next) => {

    Article.find()
        .then((result) => {
            const sortedArticles = result.sort((a, b) => b.createdAt - a.createdAt)
            res.json(sortedArticles);
        })
        .catch((error) => {
            res.json(error);
        })
})

// Route to sort articles in ascending order

router.get('/api/articles/sort/ascending', isAuthenticated, (req, res, next) => {

    Article.find()
        .then((result) => {
            const sortedArticles = result.sort((a, b) => a.createdAt - b.createdAt)
            res.json(sortedArticles);
        })
        .catch((error) => {
            res.json(error);
        })
})

// GET - get a specific article by id

router.get('/api/articles/:articleId', isAuthenticated, (req, res, next) => {
    console.log("object from the request parameters: ", req.params);

    const { articleId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(articleId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Article.findById(articleId)

        .populate('user comments')
        .then((article) => {
            console.log('found article from the database: ', article);
            res.status(200).json(article);
        })
        .catch((error) => {
            res.json(error);
        });
});


// PUT - update a specific article by id

router.put('/api/articles/:articleId', isAuthenticated, (req, res, next) => {
    const { articleId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(articleId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Article.findByIdAndUpdate(articleId, req.body, { new: true })
        .then((updatedArticle) => {
            console.log('updated article: ', updatedArticle);
            res.json(updatedArticle);
        })
        .catch((error) => {
            res.json(error);
        });

});

// Delete a specific article by id

router.delete('/api/articles/:articleId', isAuthenticated, (req, res, next) => {
    console.log("parameters:", req.params)
    const { articleId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(articleId)) {
        res.status(400).json({ message: 'Specified id is not valid' })
        return;
    }

    Article.findById(articleId)

        .then((article) => {
            console.log('article to be removed: ', article);
            const userId = article.user;
            console.log('this is the user id: ', userId);

            // delete article from user before removing it from the db.
            return User.findOneAndUpdate({ _id: userId }, { $pull: { articles: article._id } })

        })
        .then((updatedUser) => {
            return Article.findByIdAndRemove(articleId)

        })
        .then(() => {
            res.json('article removed.')
        })
        .catch((error) => {
            res.json(error);
        });
});





module.exports = router;


























