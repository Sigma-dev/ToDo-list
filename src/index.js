require('dotenv').config();
const express = require ("express");
const bodyParser = require('body-parser');
const connection = require('./db.js').connect();
const app = express();
const port = process.env.PORT;
const jwt = require('jsonwebtoken');
app.use(bodyParser.urlencoded({ extended: true }));

require('./auth.js')(app, connection);
require('./user.js')(app, connection);
require('./todo.js')(app, connection);

app.get("/", (req, res) => {
    var path = require('path');
    res.status(200).sendFile(path.resolve('test.html'));
});

app.listen(port , () => {
    console.log("Waiting for connections on port: " + port);
});
