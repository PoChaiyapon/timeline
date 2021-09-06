require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_middleware/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.use('/user', require('./users/users.controller'));
app.use('/event', require('./events/event.controller'));
app.get('/', (req, res) => {
  res.end('Welcome by PO!');
})

// global error handler
app.use(errorHandler);

const hostname = '192.168.7.9';
// start server
const port = 4000;  //process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port,hostname, () => console.log(`Server:${hostname} listening on port ${port}`));