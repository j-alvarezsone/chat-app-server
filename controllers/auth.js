const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

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

    // general el jwt
    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      user,
      token,
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

  try {
    // verificar si existe el correo
    const userDB = await User.findOne({ email });
    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'User does not exist with that email',
      });
    }

    // validar el password
    const validPassword = bcrypt.compareSync(password, userDB.password);
    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: 'Incorrect password',
      });
    }

    // general el jwt
    const token = await generateJWT(userDB.id);

    res.json({
      ok: true,
      user: userDB,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Please be in contact with the administrator',
    });
  }
};

const revalidateToken = async (req, res) => {
  const uid = req.uid;

  // generar un nuevo JWT
  const token = await generateJWT(uid);

  // obtener el usuario por uid
  const user = await User.findById(uid);

  res.json({
    ok: true,
    user,
    token,
  });
};

module.exports = {
  createUser,
  userLogin,
  revalidateToken,
};
