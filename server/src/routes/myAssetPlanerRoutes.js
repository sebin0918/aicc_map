const express = require('express');
const { getUserTargetBudget, 
        updateUserTargetBudget, 
        getUserCapital, 
        getUserDeposit, 
        getUserInstallmentSaving, 
        getUserLoan, 
        getUserStockInfo
    } = require('../controllers/myAssetPlanerController');
// 미들웨어 불러오기 
const authenticateToken = require('../middlewares/authenticateToken'); 
const router = express.Router();

router.get('/capital', authenticateToken, getUserCapital);
router.get('/target', authenticateToken, getUserTargetBudget);
router.put('/target', authenticateToken, updateUserTargetBudget);
router.get('/deposit', authenticateToken, getUserDeposit);
router.get('/installmentsaving', authenticateToken, getUserInstallmentSaving);
router.get('/loan', authenticateToken, getUserLoan);
router.get('/stock', authenticateToken, getUserStockInfo);

module.exports = router;
