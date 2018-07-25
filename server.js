const express = require('express');
const userDb = require('./data/helpers/userDb');
const postDb = require('./data/helpers/postDb');
const tagDb = require('./data/helpers/tagDb');

const server = express();

server.use(express.json());

server.get('/user', (req, res) => {
  userDb
    .get()
    .then(response => {
      res
        .status(200)
        .json(response)
        .end()
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: `The user information could not be retrieved.` })
        .end()
    })
})

server.get('/user/:id', (req, res) => {
  const id = req.params.id;
  userDb
    .get(id)
    .then(response => {
      res
        .status(200)
        .json(response)
        .end()
    })
    .catch(() => {
      res
        .status(404)
        .json({ error: `The specified User Id does not exist.` })
        .end();
    })
})

server.get('/posts', (req, res) => {
  postDb
    .get()
    .then(response => {
      res
        .status(200)
        .json(response)
        .end()
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: `The posts information could not be retrieved.` })
        .end()
    })
})

server.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  postDb
    .get(id)
    .then(response => {
      res
        .status(200)
        .json(response)
        .end()
    })
    .catch(() => {
      res
        .status(404)
        .json({ error: `The specified Post Id does not exist.` })
        .end()
    })
})


server.listen(8000, () => console.log(`... API is running on port 8000 ...`));