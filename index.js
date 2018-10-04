// Node Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

// Database Helpers
const userDb = require('./data/helpers/userDb');
const postDb = require('./data/helpers/postDb');

const server = express();

server.use(express.json(), cors(), morgan('combined'), helmet());

///// ===============- SERVER CRUD ENDPOINTS -===============

// ##### Error Messages #####

// USER Errors
const missingUserName = { errorMessage: "Please provide a name for the user." }
const unableToCreateUser500 = { errorMessage: "Unable to create user." }
const userNotFound = { errorMessage: "The user with the specified ID does not exist." }
const unableToFindSingleUser500 = { errorMessage: "The user information could not be retrieved." }
const unableToFindUsers500 = { errorMessage: "Unable to retrieve users." }


// POST Errors
const missingPostData = { errorMessage: "Please provide an id and text parameter for the post." }
const unableToCreatePost500 = { errorMessage: "Unable to create user." }
const postNotFound = { errorMessage: "The post with the specified ID does not exist." }
const unableToFindSinglePost500 = { errorMessage: "The post information could not be retrieved." }
const unableToFindPosts500 = { errorMessage: "Unable to retrieve posts." }


//// ==========- USER DATABASE CRUD ENDPOINTS -==========

/// #####=- Root Server READ Endpoint -=#####
server.get('/', (request, response) => {
    response.status(200).send(`It's working!`);
})

/// #####=- READ All Users Endpoint -=#####
server.get('/users', (request, response) => {

    // Database Promise Method
    userDb.get()
    .then(users => response.status(200).send(users))
    .catch(() => response.status(500).send(unableToFindUsers500))
})

/// #####=- READ Individual User Endpoint -=#####
server.get('/users/:userId', (request, response) => {

    const userId = request.params.userId;

    // Database Promise Method
    userDb.get(userId)
    .then(user => {
        if (!user) {
            response.status(400).send(userNotFound)
        }
        response.status(200).send(user)
    })
    .catch(() => response.status(500).send(unableToFindSingleUser500))
})

/// #####=- CREATE Individual User Endpoint -=#####
server.post('/users',  (request, response) => {

    // Unique Error Message
    const error500 = { errorMessage: "Unable to create user." };

    // Request Validation
    const { name } = request.body;
    
    if ( !name ) {
        response.status(400).send(missingUserName);
    }

    // Database Promise Method
    userDb.insert({'name': name})
    .then( userId => {
        userDb.get(userId.id)
        .then(user => {
            if (!user) {
                response.status(400).send(userNotFound)
            }
            response.status(200).send(user)
        })
        .catch(() => response.status(500).send(unableToFindSingleUser500))
    })
    .catch(() => response.status(500).send(unableToCreateUser500))
})

//// ==========- POST DATABASE CRUD ENDPOINTS -==========

/// #####=- READ All Posts Endpoint -=#####
server.get('/posts', (request, response) => {

    // Database Promise Method
    postDb.get()
    .then(posts => response.status(200).send(posts))
    .catch(() => response.status(500).send(unableToFindPosts500))
})

/// #####=- READ Individual Post Endpoint -=#####
server.get('/posts/:postId', (request, response) => {

    const postId = request.params.postId;

    // Database Promise Method
    postDb.get(postId)
    .then(post => {
        if (!post) {
            response.status(400).send(postNotFound)
        }
        response.status(200).send(post)
    })
    .catch(() => response.status(500).send(unableToFindSinglePost500))
})

// #####=- Server Port Address and Listen Method -=#####
port = 9999;
server.listen(port, () => {console.log(`-=-=-=- Node Blog Server Active on Port ${port} -=-=-=-`)});