const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const createUser = async (req, res = response) => {
  try {
    const { email, password } = req.body;

    // verificar que el email no exista
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'Email already exist',
      });
    }

    const user = new User(req.body);

    // encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // grabar usuario en DB
    await user.save();

    res.json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Please be in contact with the administrator',
    });
  }
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
