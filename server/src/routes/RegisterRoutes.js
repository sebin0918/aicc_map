const express = require('express');
const { postUserRegister, postEmailCode, postCheckEmail, postConfirmCode } = require('../controllers/RegisterController');
const router = express.Router();

router.post('/userdata', postUserRegister);
router.post('/useremail', postCheckEmail);
router.post('/usercheckcode', postEmailCode);
router.post('/userconfirmcode', postConfirmCode);


module.exports = router;