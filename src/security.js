var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

exports.generate_jwt = function(id) {
    const token = jwt.sign({
        id: id
    }, process.env.SECRET, { expiresIn: '3 hours' });
    return token;
}

exports.check_jwt = function(req, res) {
    var token = req.headers['x-access-token'];
    var cookie_token = null;
    if (req.headers.cookie)
        cookie_token = req.headers.cookie.split("token=")[1];
    if (!token)
        token = -1;
    if (token == -1 && cookie_token && cookie_token.length > 10)
        token = cookie_token;
    if (token == -1) {
        res.json({"msg": "No token , authorization  denied"});
        return -1;
    }
    try {
        const decoded = jwt.verify(token, 'secret');
        return decoded.id;
    }
    catch (ex) {
        res.json({"msg": "Token  is not  valid"});
        return -1;
    }
}

exports.hash_pw = function(password) {
    return bcrypt.hashSync(password, saltRounds);
}

exports.check_pw = function(password, hash)
{
    return bcrypt.compareSync(password, hash);
}
