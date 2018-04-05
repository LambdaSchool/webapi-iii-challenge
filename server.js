const express = require('express');
// const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const userRoutes = require('./users/userRoutes.js');
const postRoutes = require('./users/postRoutes.js');
const tagsRoutes = require('./users/tagRoutes.js');

const server = express();

// custom middleware [m1, m2, mn] -> [request handlers]
function logger(req, res, next) {
  // next points to the next middleware
  console.log('body: ', req.body);
  // req.url = `${req.url}/1`;
  // res.send('done');

  next();
}

// middleware
// server.use(morgan('dev'));
server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(logger);

server.use('/api/users', userRoutes);
server.use('/api/posts', postRoutes);
server.use('/api/tags', tagsRoutes);

server.get('/', function(req, res) {
  res.json({ api: 'Running...' });
});

const port = 5000;
server.listen(port, () => console.log('API Running on port 5000'));