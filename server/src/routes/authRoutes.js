const express = require('express');
const router = express.Router();
const userLoginController = require('../controllers/userLoginController');

// 로그인 라우트
router.post('/login', userLoginController.login);

module.exports = router;
