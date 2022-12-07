const express = require("express")
const router = express.Router();
const User = require("../models/User.model");

const isAuthenticated = require("../middleware/jwt.middleware");
const { default: mongoose } = require("mongoose");

router.get('/api/user/:userId', (req, res, next) => {
    console.log('parameter from the request', req.params);

    const { userId } = req.params;
    // res.json('all good here')
    User.findById(userId)
        .then((userFromDB) => {
            res.json(userFromDB);
        })
        .catch((error) => {
            res.json(error);
        });


})

router.put('/api/user/:userId', (req, res, next) => {
    console.log('parameter from request:', req.params);
    console.log('body from request: ', req.body);
    const { userId } = req.params;

    User.findByIdAndUpdate(userId, req.body, { new: true })
        .then((updatedUser) => {
            res.json(updatedUser)
        })
})





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