const express = require("express");
const userRoutes = require('./users/userRoutes')
const postRoutes = require('./posts/postRoutes')
const cors = require("cors");
const helmet = require("helmet");
const logger = require("morgan");
const PORT = 9090;
const server = express();

server.use(express.json(), logger("tiny"), helmet(), cors());

// Error handler

const errorHelper = (status, message, res) => {
  res.status(status).json({ error: message });
};



server.use('/api/users', userRoutes)
server.use('/api/posts', postRoutes)

server.use('/', (req, res) => {
  res.json('API is running.')
});

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));