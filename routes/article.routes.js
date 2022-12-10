const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');



const Article = require('../models/Article.model');
const User = require('../models/User.model');
const hash = require('object-hash');

// import middleware to protect routes
const { isAuthenticated } = require('../middleware/jwt.middleware');

// POST - create article and add it to the user

router.post('/api/articles', isAuthenticated, (req, res, next) => {
    // console.log(req.body);

    const { image, url, name, description, user } = req.body;

    const articleHash = hash.MD5(req.body);

    // search for hash

    Article.findOne({ external_id: articleHash })
        .then((foundHash) = {

            if(foundHash) {

                return User.findByIdAndUpdate(user, foundHash, { new: true })
            }
        })


    Article.create({ image, url, name, description, user })
        .then((newArticle) => {
            console.log("Created article from database: ", newArticle);
            return User.findByIdAndUpdate(user, { $push: { articles: newArticle._id } })
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

    Article.find()


        .populate('user comments')
        .then((allArticles) => {
            console.log('All articles from the db: ', allArticles);
            res.json(allArticles);
        })
        .catch((error) => {
            res.json(error)
        });
});
// Route to sort articles in descending order
router.get('/api/articles/sort/descending', isAuthenticated, (req, res, next) => {

    Article.find()
        .then((result) => {
            const sortedArticles = result.sort((a, b) => b.createdAt - a.createdAt)
            console.log('my articles: ', sortedArticles)
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
            console.log('my articles: ', sortedArticles);
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


// router.get('/api/articles/:articleId', isAuthenticated, (req, res, next) => {

//     const { articleId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(articleId)) {
//         res.status(400).json({ message: 'Specified id is not valid' });
//         return;
//     }


//     Article.findById(articleId)
//         .populate('user comments') // <-- the same as .populate('author).populate('comments')
//         .populate({
//             // we are populating author in the previously populated comments
//             path: 'comments',
//             populate: {
//                 path: 'user',
//                 model: 'User'
//             }
//         })
//         .then(foundArticle => res.status(200).json(foundArticle))
//         .catch(error => {
//             res.json(error)
//         });
// });





// PUT - update a specific article by id

router.put('/api/articles/:articleId', isAuthenticated, (req, res, next) => {
    console.log("request body object: ", req.body);
    console.log('id parameters: ', req.params);

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

    Article.findByIdAndRemove(articleId)
        .then(() => {
            res.json({ message: `Article #${articleId} is removed` })
        })
        .catch((error) => {
            res.json(error);
        });

    /* another approach using includes() method 
    
    Article.findById(articleId)
    .then((article) => {
        const userId = article.user;
        console.log("user id: ", userId)
        return User.findById(userId)
    })
    .then((userFromDB) => {
        console.log("Found user from db:", userFromDB)
        const userArticles = userFromDB.articles;
        console.log('array of articles: ', userArticles)
        if (userArticles.includes(articleId)) {
            return User.findByIdAndUpdate(userFromDB._id, { $pull: { articles: articleId } })
        }

    })
Article.findByIdAndRemove(articleId)
    .then(() => {
        res.json({ message: `Article # ${articleId} is removed` })
    })
    
    */

});
module.exports = router;







