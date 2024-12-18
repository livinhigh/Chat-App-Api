const jwt = require('jsonwebtoken');
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
module.exports = generateToken;
