const express = require('express');
const bodyParser = require('body-parser');

const server = express();
const PORT = 3030;
const STATUS_SUCCESS = 200;
const STATUS_USER_ERROR = 422;

server.use((req, res, next) => {
  next();
});

server.use(bodyParser.json());

let idCounter = 3;
let users = [
  { "id": 1, "name": "German"},
  { "id": 2, "name": "Aaron"},
  { "id": 3, "name": "Dylan"},
];

server.get('/users', (req, res) => {
  console.log('req.query: ', req.query);
  console.log('users: ', users);
  console.log('users[1]: ', users[1]);
  if (req.query.name) {
    let user = null;
    Object.keys(users).forEach((id => {
      if (users[id] === req.query.name) {
        user = id;
      };
    }));
    res.status(STATUS_SUCCESS);
    res.send(user);
  } else {
    res.status(STATUS_USER_ERROR);
    res.send(users);
  }
});

server.post('/users', (req, res) => {
    const {name} = req.body;
    const usersObj = {name, id: ++idCounter};
    users.push(usersObj);
    res.status(STATUS_SUCCESS);
    res.send(users);
});

server.get('/users', (req, res) => {
    res.status(STATUS_SUCCESS);
    res.send(users);
});

server.get('/users/:id', (req, res) => {
    const {id} = req.params;
    const foundUser = users.find((user) => user.id == id);

    if (foundUser) {
        res.status(STATUS_SUCCESS).send({foundUser});
        console.log('foundUser =>', foundUser);
    } else {
        res.status(STATUS_USER_ERROR)
    }

});

server.delete('/users/:id', (req, res) => {
    const {id} = req.params;
    const foundUser = users.find((user) => user.id == id);

    if (foundUser) {
        const userRemoved = {...foundUser};
        users = users.filter(user => user.id != id);
        res.status(STATUS_SUCCESS).json({users});
    } else {
        res.status(STATUS_USER_ERROR);
    }
});


server.listen(PORT, (err) => {
    if (err) {
        console.log(`There was an error starting the server: ${err}`);
    } else {
        console.log(`Server is listening on port ${PORT}`)
    }
});