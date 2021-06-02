/*
path: /api/login
*/

const { Router } = require('express');
const { createUser, userLogin, revalidateToken } = require('../controllers/auth');

const router = Router();
// crear nuevos usuarios
router.post('/new', createUser);

// login
router.post('/', userLogin);

// revalidar token
router.get('/renew', revalidateToken);

module.exports = router;
