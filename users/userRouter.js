const express = require("express");
const Users = require("./userDb");
const Posts = require("../posts/postDb");
const router = express.Router();

//custom middleware

const validateUserId = async (req, res, next) => {
    const userId = req.params.id;
    const currentUser = await Users.getById(userId);
    if(!userId || isNaN(parseInt(userId, 10)) || !currentUser){
        res.status(400).json({errorMessage: 'invalid user id'})
    }
    else {
        req.user = currentUser;
        next();
    }
};

function validateUser(req, res, next) {
    if(Object.keys(req.body) == 0){
        res.status(404).json({ errorMessage: "missing user data" });
    }
    else if(!req.body.name){
        res.status(400).json({ errorMessage: "missing required name field" });
    }
    else next();
};

function validatePost(req, res, next) {
    if(Object.keys(req.body) == 0){
        res.status(404).json({ errorMessage: "missing post data" });
    }
    else if(!req.body.text){
        res.status(400).json({ errorMessage: "missing required text field" });
    }
    else next();
};

// endpoints


// Create a new user
router.post('/', async (req, res) => {
    const { name } = req.body;
    try {
        const newUser = await Users.insert({name});
        res.status(200).json(newUser);
    } 
    catch (error) {
        res.status(500).json({ errorMessage: "There was an error while adding the new user" });
    }
});

// create a post for a user by its id
router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
    const user_id = req.user.id;
    const text = req.body.text;
    try {
        const insertedPost = await Posts.insert({text, user_id});
        // const newCommentData =  await Posts.findCommentById(insertedComment.id);
        res.status(200).json(insertedPost);
    } 
    catch (error) {
        res.status(500).json({ errorMessage: "There was an error while saving the post to the database" });
    }  

});

// get all users in the DB
router.get('/', async (req, res) => {
    try {
        const allUsers = await Users.get();
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." });
    }
});

// get user by its id
router.get('/:id', async (req, res) => {
    const userId = req.user.id;
    try {
    const user = await Users.getById(userId);
    if(user){
        res.status(200).json(user);
    }
    else {
        res.status(404).json({ errorMessage: "The user with the specified ID does not exist." });
    }
    } catch (error) {
    res.status(500).json({ errorMessage: "The user information could not be retrieved." });
    }
});

// get list of post for a given user id
router.get('/:id/posts', validateUserId, async (req, res) => {
    const userId = req.user.id;
    try {
    const posts = await Users.getUserPosts(userId);
    if(posts && posts.length > 0){
        res.status(200).json(posts);
    }
    else {
        res.status(404).json({ errorMessage: "The post with the specified user ID does not exist." });
    }
    } catch (error) {
    res.status(500).json({ errorMessage: "The posts information could not be retrieved." });
    }
});

// delete a user
router.delete('/:id', validateUserId, async (req, res) => {
    const userId = req.user.id;
    const deletedUser = req.user;
    try{
        await Users.remove(userId);
        res.status(200).json(deletedUser)
    }
    catch(error){
        res.status(500).json({ errorMessage: "The user could not be removed" });
    }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
    try{
        const name = req.body;
        const userIdToUpdate = req.user.id;
        await Users.update(userIdToUpdate, name);
        const updatedUser = await Users.getById(userIdToUpdate);
        res.status(200).json(updatedUser);
    }
    catch(error){
        res.status(500).json({ errorMessage: "The user could not be updated" });
    }
});

module.exports = router;
