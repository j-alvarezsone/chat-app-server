/*
path: /api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, userLogin, revalidateToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();
// crear nuevos usuarios
router.post(
  '/new',
  [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'The password must be 6 characters').isLength({ min: 6 }),
    validateFields,
  ],
  createUser,
);

// login
router.post(
  '/',
  [
    check('email', 'Email is required').isEmail(),
    check('password', 'The password must be 6 characters').isLength({ min: 6 }),
    validateFields,
  ],
  userLogin,
);

// revalidar token
router.get('/renew', validateJWT, revalidateToken);

module.exports = router;
