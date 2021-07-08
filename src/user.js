const secu = require('./security.js');

function send_user(res, user)
{
    res.status(200).json({
        "id" : user.id,
        "email" : user.email,
        "password" : user.password,
        "created_at" : user.created_at,
        "firstname" : user.firstname,
        "name" : user.name
    });
}


module.exports = function(app, connection){
    app.get("/user", (req, res) => {
        var id = secu.check_jwt(req, res);
        if (id == -1)
            return;
        connection.query('SELECT * FROM user WHERE id = ' + id, (err, rows) => {
            if (err)
                return res.status(500).send("DataBase Error");
            if (rows && rows.length) {
                send_user(res, rows[0]);
            }
        });
    });
    app.get("/user/todos", (req, res) => {
        var id = secu.check_jwt(req, res);
        if (id == -1)
            return;
        var query = 'SELECT * FROM todo WHERE user_id = ' + id;
        connection.query(query, (err, rows) => {
            if (err) {
                return res.status(500).send("DataBase Error");
            }
            if (rows && rows.length == 0)
                res.status(200).send("No Tasks to do");
            if (rows && rows.length > 0) {
                var json = [];
                for(var i in rows) {
                    var item = rows[i];
                    json.push({
                        "id" : rows[i].id,
                        "title" : rows[i].title,
                        "description" : rows[i].description,
                        "created_at" : rows[i].created_at,
                        "due_time" : rows[i].due_time,
                        "user_id" : rows[i].user_id,
                        "status" : rows[i].status
                    });
                }
                res.status(200).json(json);
            }
        });
    });
    app.get("/user/:id", (req, res) => {
        var id = secu.check_jwt(req, res);
        if (id == -1)
            return;
        var identificator = req.params.id;
        var query;
        if (isNaN(identificator))
            query = 'SELECT * FROM user WHERE email = ' + '\''+identificator+'\'';
        else
            query = 'SELECT * FROM user WHERE id = ' + identificator;
        connection.query(query, (err, rows) => {
            if (err) {
                res.status(500).send(err);
            }
            if (rows && rows.length == 0)
                res.status(401).send("No user with given identification");
            if (rows && rows.length) {
                send_user(res, rows[0]);
	    }
        });
    });
    app.put("/user/:id", (req, res) => {
        var id = secu.check_jwt(req, res);
        var body = req.body;
        if (id == -1)
            return;
        if (body.email === undefined || body.name === undefined
            || body.firstname === undefined || body.password === undefined) {
            res.status(400).send("Missing body in your request");
            return;
        }
        var query = 'UPDATE user SET email=\''+body.email+'\''
            +'name=\''+body.name+'\''+'firstname=\''+body.firstname+'\''+
            'password=\''+body.password+'\' WHERE id = ' + req.params.id;
        connection.query(query, (err, rows) => {
            if (err)
                res.status(500).send(err);
            if (rows && rows.length) {
                send_user(res, rows[0]);
            }
        });

    });
    app.delete("/user/:id", (req, res) => {
        var id = secu.check_jwt(req, res);
        if (id == -1)
            return;
        var query = 'DELETE FROM user WHERE id =' + req.params.id;
        connection.query(query, (err, rows) => {
            if (err)
                res.status(500).send(err);
            else
                res.status(200).json({"msg" : "succesfully  deleted  record  number: " + req.params.id});
        });
    });
}
