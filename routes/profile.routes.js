
const express = require('express');
const router = express.Router();

const User = require('../models/User.model');

router.post('/api/profile', (req, res, next) => {
    console.log(req.body)
    // const { email, password, firstName, lastName } = req.body;

    // User.create({ firstName, lastName, email, password, articles: [] })
    //     .then((newUser) => {
    //         console.log('user created: '.newUser);
    //         res.json(newUser)
    //     })
    //     .catch((error) => {
    //         res.json(error)
    //     });

});

module.exports = router;