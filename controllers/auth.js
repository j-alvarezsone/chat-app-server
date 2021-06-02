const { response } = require('express');

const createUser = async (req, res = response) => {
  const { name, email, password } = req.body;
  res.json({
    ok: true,
    user: 'new',
    name,
    email,
    password,
  });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  res.json({
    ok: true,
    msg: 'login',
    email,
    password,
  });
};

const revalidateToken = async (req, res) => {
  res.json({
    ok: true,
    msg: 'renew',
  });
};

module.exports = {
  createUser,
  userLogin,
  revalidateToken,
};
