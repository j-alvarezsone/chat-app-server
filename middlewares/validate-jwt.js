const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req, res = response, next) => {
  try {
    // x-token headers
    const token = req.header('x-token');

    if (!token) {
      return res.status(401).json({
        ok: false,
        msg: 'There is no token in the request',
      });
    }

    const { uid } = jwt.verify(token, process.env.JWT_KEY);
    req.uid = uid;

    next();
  } catch (err) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no valid',
    });
  }
};

module.exports = {
  validateJWT,
};
