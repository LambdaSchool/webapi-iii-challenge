const express = require("express");
const router = express.Router();
const db = require("./userDb.js");

//----------------------------------------------------------------------------//
// CRUD Operations
//----------------------------------------------------------------------------//


// post to ::  /api/users
router.post('/', (req, res) => {
db.insert(req.body)
.then(user => {
  res.status(201).json(user);
})
.catch(error => {
  res.status(500).json({
    message: "Error adding user"
  })
})
});

// post to ::  /api/users/:id/posts
router.post('/:id/posts', validateUserId, (req, res) => {
});

// get :: /api/users
router.get('/', (req, res) => {
db.get(req.query)
.then(users => {
  res.status(200).json(users);
})
.catch(error => {
  res.status(500).json({
    message: "Error retrieving the users"
  })
})
});

// get :: /api/users/:id
router.get('/:id', (req, res) => {

});

// get :: /api/users/:id/posts
router.get('/:id/posts', (req, res) => {

});

// delete :: /api/users/:id
router.delete('/:id', (req, res) => {

});

// update :: /api/users/:id
router.put('/:id', (req, res) => {

});


//----------------------------------------------------------------------------//
// MIDDLEWARE
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// validates the user id on every request that expects a user id parameter
//----------------------------------------------------------------------------//

function validateUserId(req, res, next) {
  // if the id parameter is valid, store that user object as req.user
  const { id } = req.params;
  db.getById(id).then(userId => {
    if (userId) {
      req.userId = userId;
      next();
      // if the id parameter does not match any user id in the database, cancel the request and respond with status 400 and { message: "invalid user id" }
    } else {
      res
        .status(400)
        .json({
          Message: "invalid user id"
        })
        .catch(err => {
          res.status(500).json({ message: "Error Retrieving Data", error });
        });
    }
  });
}

//----------------------------------------------------------------------------//
// validateUser validates the body on a request to create a new user
//----------------------------------------------------------------------------//

function validateUser(req, res, next) {
  const userBody = req.body;

  // if the request body is missing, cancel the request and respond with status 400 and { message: "missing user data" }
  if (Object.keys(userBody).length < 1) {
    res.status(400).json({
      Message: "missing user data"
    });
  } else if (!userBody.name) {
    // if the request body is missing the required name field, cancel the request and respond with status 400 and { message: "missing required name field" }
    res.status(400).json({
      Message: "missing required name field"
    });
  } else {
    next();
  }
}

//----------------------------------------------------------------------------//
// validatePost validates the body on a request to create a new post
//----------------------------------------------------------------------------//

function validatePost(req, res, next) {
  const postBody = req.body;

  // if the request body is missing, cancel the request and respond with status 400 and { message: "missing post data" }
  if (Object.keys(postBody).length < 1) {
    res.status(400).json({
      Message: "Missing Post Data"
    });
  } else if (!postBody.text) {
    // if the request body is missing the required text field, cancel the request and respond with status 400 and { message: "missing required text field" }
    res.status(400).json({
      Message: "Missing required text field"
    });
  } else {
    next();
  }
}

module.exports = router;
