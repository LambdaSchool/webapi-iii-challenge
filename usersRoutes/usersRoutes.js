const express = require('express');

const router = express.Router();

const userDb = require('../data/helpers/userDb');

function upperCase(req, res, next) {
    let { name } = req.body;
    const upperCaseName = name.charAt(0).toUpperCase() + name.slice(1);
    req.body.name = upperCaseName;
    next();
}

router.get("/", (req, res) => {
    userDb.get()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: err });
        })
})

router.get('/:id', (req, res) => {
    const { id } = req.params;
    userDb.getById(id)
        .then(user => {
            user ? res.json(user) : res.status(404).json({ message: "This user does not exist." });
        })
        .catch(err => {
            res.status(500).json({ errorMessage: err });
        })
})

router.get('/:id/userPosts', (req, res) => {
    const { id } = req.params;
    userDb.getUserPosts(id).then(userPosts => {
        userPosts.length ? res.json(userPosts) : res.status(404).json({ message: "Either this user does not exist or they have no posts" });
    }).catch(err => {
        res.status(500).json({ errorMessage: err });
    });
})

router.post('/', upperCase, (req, res) => {
    const newUser = req.body;
    if (newUser.name) {
        userDb.insert(newUser)
            .then(user => {
                res.json(user);
            })
            .catch(err => {
                res.status(500).json({ errorMessage: err });
            });
    } else {
        res.status(400).json({ message: "Please input a user name." });
    }
})

module.exports = router;