const secu = require('./security.js');

module.exports = function(app, connection){
    app.post("/todo", (req, res) => {
        var id = secu.check_jwt(req, res);
        if (id == -1)
            return;
        if (req.body.title === undefined || req.body.description === undefined
            || req.body.due_time === undefined || req.body.user_id === undefined
            || req.body.status === undefined) {
            res.status(400).send("Missing body in your request");
            return;
        }
        var values = '\''+req.body.title+'\',\''+req.body.description+'\',\''+req.body.due_time+'\','+req.body.user_id+',\''+req.body.status+'\'';
        var query = 'INSERT INTO todo(title,description,due_time,user_id,status) VALUES ('+values+')';
        connection.query(query, (err, rows) =>
        {
            if (err) {
                res.status(500).send("Error in DB Write");
                console.log(err);
                return;
            }
            else {
                res.status(200).json({
                    "id" : rows.insertId,
                    "title" : req.body.title,
                    "description" : req.body.description,
                    "created_at" : req.body.created_at,
                    "due_time" : req.body.due_time,
                    "user_id" : req.body.user_id,
                    "status" : req.body.status
                });
            }
        });
    });
    app.get("/todo/:id", (req, res) => {
        var id = secu.check_jwt(req, res);
        if (id == -1)
            return;
        var todo_id = req.params.id;
        var query = 'SELECT * FROM todo WHERE id = ' + todo_id;
        connection.query(query, (err, rows) => {
            if (err) {
                res.status(500).send(err);
            }
            if (rows && rows.length) {
                res.status(200).json({
                        "id" : rows[0].id,
                        "title" : rows[0].title,
                        "description" : rows[0].description,
                        "created_at" : rows[0].created_at,
                        "due_time" : rows[0].due_time,
                        "user_id" : rows[0].user_id,
                        "status" : rows[0].status
                    });
            }
            if (rows.length == 0)
                res.status(200).send("No task with Id:" + todo_id);
        });
    });
    app.put("/todo/:id", (req, res) => {
        var id = secu.check_jwt(req, res);
        var body = req.body;
        if (id == -1)
            return;
        if (body.title === undefined || body.description === undefined
            || body.due_time === undefined || body.user_id === undefined
            || body.status === undefined) {
            res.status(400).send("Missing body in your request");
            return;
        }
        var query = 'UPDATE todo SET title=\''+body.title+'\',description=\''+body.description+'\',due_time=\''+body.due_time+'\',user_id=\''+body.user_id+'\',status=\''+body.status+ '\' WHERE id = ' + req.params.id;
        console.log(query);
        connection.query(query, (err, rows) => {
            if (err)
                res.status(500).send(err);
            if (rows && rows.length) {
                res.status(200).json({
                    "title" : body.title,
                    "description" : body.description,
                    "due_time" : body.due_time,
                    "user_id" : body.user_id,
                    "status" : body.status
                });
            }
        });

    });
    app.delete("/todo/:id", (req, res) => {
        var id = secu.check_jwt(req, res);
        if (id == -1)
            return;
        var query = 'DELETE FROM todo WHERE id =' + req.params.id;
        connection.query(query, (err, rows) => {
            if (err)
                res.status(500).send(err);
            else
                res.status(200).json({"msg" : "succesfully  deleted  record  number: " + req.params.id});
        });
    });
}
