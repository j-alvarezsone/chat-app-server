const { response } = require('express');

const createUser = async (req, res = response) => {
  res.json({
    ok: true,
    user: 'new',
  });
};

const userLogin = async (req, res) => {
  const body = req.body;
  res.json({
    ok: true,
    msg: 'login',
    body,
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
