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

    const { email, password, firstName, lastName } = req.body;

    const { userId } = req.params;


    //make sure every input field is filled 

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "Provide full name ,email and password." });
    }

    // validate email format 

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Provide a valid email address." });
    }

    //validate password format
    if (password.length < 6) {
        return res.status(400).json({ message: "6 character minimum." });
    }

    /*   this code is using regex validation format
    
          const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    
       if (!passwordRegex.test(password)) {
        res.status(400).json({ message: 'Password must have at least 6 chars and contain at least one number, one lowercase and one uppercase letter' })
        return;
          }
    */

    // if (email) {
    //     const salt = bcrypt.genSaltSync(saltRounds);
    //     const hashedPassword = bcrypt.hashSync(password, salt);
    //     req.body.password = hashedPassword;
    // }

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
    User.findByIdAndRemove(userId)
        .then(() => {
            res.json({ message: 'Your account has been deleted' })
        })
        .catch((error) => {
            console.log(error);
        });
});
module.exports = router;