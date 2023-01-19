const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');



const router = express.Router();

const { isAuthenticated } = require('../middleware/jwt.middleware');

const saltRounds = 10;

//POST - sign up to create new user 

router.post('/auth/signup', (req, res, next) => {
    console.log(req.body)


    const { email, password, firstName, lastName } = req.body;

    // check of fields are provided and not empty
    if (!email || !password || !firstName || !lastName) {
        res.status(400).json({ message: "Provide email, password and full name." });
        return;
    }

    // Use regex to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Provide a valid email address." });
        return;
    }

    if (password.length < 6) {
        res.status(400).json({ message: "Password needs to be at least 6 characters long." });
        return;
    }

    /*   this code is using regex validation format
    
          const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    
       if (!passwordRegex.test(password)) {
        res.status(400).json({ message: 'Password must have at least 6 chars and contain at least one number, one lowercase and one uppercase letter' })
        return;
          }
    */

    // check if user exists with the same email

    User.findOne({ email: email })
        .then((foundUser) => {
            if (foundUser) {
                res.status(400).json({ message: "Email is already taken." });
                return;
            }

            //if user is unique, hash password
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt)

            //create new user in the db
            return User.create(
                {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName
                }
            )

        })
        .then((createdUser) => {
            console.log('this is the new user: ', createdUser)

            //don't expose password

            const { email, firstName, lastName, _id } = createdUser;

            // create new object that doesn't include the password

            const user = {
                email,
                firstName,
                lastName,
                _id
            }

            res.status(201).json({ user: user });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error.' })
        })


})

//POST  - log in. verifiy email and password and return a jwt

router.post('/auth/login', (req, res, next) => {
    console.log('the request body: ', req.body);

    const { email, password } = req.body;
    //check of fields are provided and not empty
    if (!email || !password) {
        res.status(400).json({ message: "Provide email and password." })
        return;
    }

    if (password.length < 6) {
        res.status(400).json({ message: "Password needs to be at least 6 characters long." })
        return;
    }
    //check database to see if user exists

    User.findOne({ email })
        .then((foundUser) => {
            if (!foundUser) {
                res.status(401).json({ message: "User not found." })
                return;
            }



            // compare password with the one saved in the database
            const isPasswordCorrect = bcrypt.compareSync(password, foundUser.password);

            if (isPasswordCorrect) {
                console.log('welcome back ' + foundUser.firstName)
                // deconstruct user object and don't include password
                const { email, _id, firstName, lastName } = foundUser;

                // create an object that will be the token payload
                const payload = {
                    email,
                    _id,
                    firstName,
                    lastName

                }

                // create and sign token
                const authToken = jwt.sign(

                    payload,
                    process.env.TOKEN_SECRET,
                    {
                        algorithm: "HS256",
                        expiresIn: "6h"
                    }

                );
                // send token as the response
                res.status(200).json({ authToken: authToken })

            }
            else {
                res.status(401).json({ message: 'Unable to authenticate user.' })
            }


        })
        .catch((error) => {
            res.status(500).json({ message: "Internal Server Error." })
        });



});

//  GET  -verify jwt stored on the client
router.get('/auth/verify', isAuthenticated, (req, res, next) => {
    // if jwt token is valid, the payload gets decoded by middleware and is available on the req.payload

    console.log('req.payload:', req.payload);

    // send back object with user data
    res.status(200).json(req.payload)

});


module.exports = router;


