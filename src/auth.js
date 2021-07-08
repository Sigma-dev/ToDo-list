const secu = require('./security.js');

function successful_register(req, res, connection)
{
    var hash = secu.hash_pw(req.body.password);
    var values = '\''+req.body.email+'\',\''+hash+'\',\''+req.body.name+'\',\''+req.body.firstname+'\'';
    var query = 'INSERT INTO user(email,password,name,firstname) VALUES ('+values+')';
    connection.query(query, (err, rows) =>
    {
        if (err) {
            res.status(500).send("Error in DB Write");
            console.log(err);
            return;
        }
        var token = secu.generate_jwt(rows.insertId);
        res.cookie('token', token);
        res.status(200).json({ token : token});
    });
}

module.exports = function(app, connection){
    const secu = require('./security.js');
    app.post("/register", (req, res) => {
        if (req.body.email === undefined || req.body.name === undefined
            || req.body.firstname === undefined || req.body.password === undefined) {
            res.status(400).send("Missing body in your request");
            return;
        }
        connection.query('SELECT * FROM user WHERE email = \'' + req.body.email + '\'', (err, rows) => {
            if (rows && rows.length ) {
                res.status(403).json({ "msg": "account already exists"});
                return;
            }
            successful_register(req, res, connection);
        });
    });

    app.post("/login", (req, res) => {
        if (req.body.email === undefined || req.body.password === undefined) {
	    res.status(400).send("Missing body in your request");
            return;
        }
        connection.query('SELECT * FROM user WHERE email = \'' + req.body.email + '\'', (err, rows) => {
            if (rows && rows.length && secu.check_pw(req.body.password, rows[0].password)) {
                var token = secu.generate_jwt(rows[0].id);
                res.cookie('token', token);
                res.status(200).json({ token : token});
            }
            else {
                res.status(400).json({ "msg": "Invalid Credentials"});
                return;
            }
        });
    });
}
