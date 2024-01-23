const express = require("express")
const router = express.Router();
const User = require("../models/User.model");
const mongoose = require('mongoose');

const isAuthenticated = require("../middleware/jwt.middleware");


const bcrypt = require('bcryptjs');
const saltRounds = 10;




// GET - populate user information 
router.get('/api/user/:userId', (req, res, next) => {
    console.log('parameter from the request', req.params);

    const { userId } = req.params;

    User.findById(userId)
        .populate('articles')
        .then((userFromDB) => {
            res.json(userFromDB);
        })
        .catch((error) => {
            res.json(error);
        });


})
//Put - update user account 

router.put('/api/user/:userId', (req, res, next) => {
    console.log('parameter from request:', req.params);
    console.log('body from request: ', req.body);

    const { email, firstName, lastName } = req.body;

    const { userId } = req.params;


    //make sure every input field is filled 

    if (!email || !firstName || !lastName) {
        return res.status(400).json({ message: "Provide full name ,email and password." });
    }

    // validate email format 

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Provide a valid email address." });
    }

    User.findByIdAndUpdate(userId, req.body, { new: true })
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((error) => {
            res.json(error);
        });
});





//Delete - delete user account

router.delete('/api/user/:userId', (req, res, next) => {
    console.log('parameters from the request: ', req.params);

    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'Specified id is not valid.' });
        return;
    }
    User.findByIdAndDelete(userId)
        .then(() => {
            res.json({ message: 'Your account has been deleted' })
        })
        .catch((error) => {
            console.log(error);
        });
});
module.exports = router;