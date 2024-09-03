const pool = require('../config/database');

// 총 자산 (초기자산) 불러오기
const getUserCapital = async (req, res) => {
  try {
    const userId = req.user.id; // 로그인한 사용자 id 가져오기
    const result = await pool.query('SELECT user_capital FROM tb_user WHERE user_id = ? LIMIT 1', [userId]);

    // 조회 결과 없으면 404 에러 반환
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    // 조회된 사용자 자산이 없으면 0으로 초기화
    const userCapital = result[0].user_capital || 0;
    // 조회 자산 JSON 형식 반환
    res.json({ userCapital });
  } catch (error) {

    // 에러 발생시 로그 출력 및 500 에러 반환
    console.error('Error fetching user capital:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 목표 예산 불러오기
const getUserTargetBudget = async (req, res) => {
  try {
    const userId = req.user.id; // 로그인한 사용자 id 가져오기
    const result = await pool.query('SELECT user_target_budget FROM tb_user WHERE user_id = ? LIMIT 1', [userId]);
    console.log(result); // 쿼리 결과를 출력해 확인
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 조회 목표 예산없으면 0으로 초기화
    const targetBudget = result[0].user_target_budget || 0;
    // 조회 목표 예산 JSON 형식 반환
    res.json({ targetBudget });
  } catch (error) {
    console.error('Error fetching target budget:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 목표 예산 업데이트
const updateUserTargetBudget = async (req, res) => {
  const { targetBudget } = req.body;
  if (typeof targetBudget !== 'number' || targetBudget < 0) {
    return res.status(400).json({ error: 'Invalid target budget' });
  }
  try {
    const userId = req.user.id; // 로그인한 사용자 id 가져오기
    const result = await pool.query('UPDATE tb_user SET user_target_budget = ? WHERE user_id = ?', [targetBudget, userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'Target budget updated successfully' });
  } catch (error) {
    console.error('Error updating target budget:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 정기 예금 불러오기 
const getUserDeposit = async (req, res) => {
  try {
    const userId = req.user.id; // 로그인한 사용자 id 가져오기
    const result = await pool.query('SELECT user_deposit FROM tb_user WHERE user_id = ? LIMIT 1', [userId]);
    console.log(result); // 쿼리 결과를 출력해 확인
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userDeposit = result[0].user_deposit || 0;
    res.json({ userDeposit });
  } catch (error) {
    console.error('Error fetching user deposit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// 적금 불러오기
const getUserInstallmentSaving = async (req, res) => {
  try {
    const userId = req.user.id; // 로그인한 사용자 id 가져오기
    const result = await pool.query('SELECT user_installment_saving FROM tb_user WHERE user_id = ? LIMIT 1', [userId]);
    console.log(result); // 쿼리 결과를 출력해 확인
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userInstallmentSaving = result[0].user_installment_saving || 0;
    res.json({ userInstallmentSaving });
  } catch (error) {
    console.error('Error fetching user installment saving:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


// 대출 불러오기 (대출한 총 금액)
const getUserLoan = async (req, res) => {
  try {
    const userId = req.user.id; // 로그인한 사용자 id 가져오기
    const result = await pool.query('SELECT user_loan FROM tb_user WHERE user_id = ? LIMIT 1', [userId]);
    console.log(result); // 쿼리 결과를 출력해 확인
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userLoan = result[0].user_loan || 0;
    res.json({ userLoan });
  } catch (error) {
    console.error('Error fetching user loan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// 주식 및 코인 정보 조회 및 순수익과 수익률 계산
const getUserStockInfo = async (req, res) => {
  try {
    const userId = req.user.id; // 로그인한 사용자 id 가져오기

    // 1. 유저의 삼성, 애플 주식 및 비트코인 수량 조회
    const sharesResult = await pool.query(`
      SELECT sh.sh_ss_count, sh.sh_ap_count, sh.sh_bit_count, sh.sh_date 
      FROM tb_user_shares_held us 
      JOIN tb_shares_held sh ON us.sh_id = sh.sh_id 
      WHERE us.user_id = ? LIMIT 1
    `, [userId]);
    // 없으면 에러반환
    if (sharesResult.length === 0) {
      return res.status(404).json({ error: 'User has no assets' });
    }

    // 조회 데이터 변수에 저장
    const { sh_ss_count, sh_ap_count, sh_bit_count, sh_date } = sharesResult[0];

    // 2. 구매 날짜의 삼성, 애플 주식 및 비트코인 가격 조회
    const purchaseStockResult = await pool.query(`
      SELECT sc_ss_stock, sc_ap_stock, sc_coin 
      FROM tb_stock 
      WHERE sc_date = ? LIMIT 1
    `, [sh_date]);
    // 없으면 에러 반환
    if (purchaseStockResult.length === 0) {
      return res.status(404).json({ error: 'No stock data found for purchase date' });
    }

    // 구매 당시 주식, 비코 가격 변수 저장
    const { 
      sc_ss_stock: purchaseSamsungPrice, 
      sc_ap_stock: purchaseApplePrice, 
      sc_coin: purchaseCoinPrice 
    } = purchaseStockResult[0];

    // 3. 최신 삼성, 애플 주식 및 비트코인 가격 조회
    const latestStockResult = await pool.query(`
      SELECT sc_ss_stock, sc_ap_stock, sc_coin 
      FROM tb_stock 
      ORDER BY sc_date DESC LIMIT 1
    `);
    // 없으면 에러 반환
    if (latestStockResult.length === 0) {
      return res.status(404).json({ error: 'No latest stock data found' });
    }

    // 최신 주식 및 비코 가격 변수에 저장
    const { 
      sc_ss_stock: latestSamsungPrice, 
      sc_ap_stock: latestApplePrice, 
      sc_coin: latestCoinPrice 
    } = latestStockResult[0];

    // 4. 최신 환율 조회
    const latestExchangeRateResult = await pool.query(`
      SELECT mei_ex_rate 
      FROM tb_main_economic_index 
      ORDER BY mei_date DESC LIMIT 1
    `);
    if (latestExchangeRateResult.length === 0) {
      return res.status(404).json({ error: 'No exchange rate data found' });
    }

    /* 최신 환율 변수 저장 */
    const latestExchangeRate = latestExchangeRateResult[0].mei_ex_rate;

    /* 5. 초기 자산 계산 (구매 당시) */
    const initialSamsungValue = sh_ss_count * purchaseSamsungPrice; // 삼성 
    const initialAppleValue = sh_ap_count * purchaseApplePrice; // 애플
    const initialCoinValue = sh_bit_count * purchaseCoinPrice; // 비트코인

    /* 6. 현재 자산 계산 (최신 가격 기준) */
    const currentSamsungValue = sh_ss_count * latestSamsungPrice;
    const currentAppleValue = sh_ap_count * latestApplePrice * latestExchangeRate; // 애플 원화로 환산
    const currentCoinValue = sh_bit_count * latestCoinPrice * latestExchangeRate; // 비트코인 원화로 환산

    /* 7. 순수익 계산 */
    // 삼성 주식 순수익
    const samsungProfit = currentSamsungValue - initialSamsungValue;
    // 애플 주식 순수익
    const appleProfit = currentAppleValue - initialAppleValue * latestExchangeRate; // 애플의 초기 자산도 원화로 환산
    // 비트코인 순수익
    const coinProfit = currentCoinValue - initialCoinValue * latestExchangeRate; // 비트코인의 초기 자산도 원화로 환산

    /* 8. 전체 순수익 계산 */
    // 각 순수익 합산
    const totalProfit = samsungProfit + appleProfit + coinProfit;

    /* 9. 전체 초기 자산 및 현재 자산 계산 */
    // 전체 초기 자산 = 삼성 주식 초기 자산 + (애플 주식 초기 자산 * 최신 환율) + (비트코인 초기 자산 * 최신 환율)
    const totalInitialValue = initialSamsungValue + (initialAppleValue * latestExchangeRate) + (initialCoinValue * latestExchangeRate);
    // 전체 현재 자산 = 삼성 주식 현재 자산 + 애플 주식 현재 자산 + 비트코인 현재 자산
    const totalCurrentValue = currentSamsungValue + currentAppleValue + currentCoinValue;

    /* 10. 전체 수익률 계산 */
    const totalROE = ((totalProfit / totalInitialValue) * 100).toFixed(2);

    // 계산된 자산 정보, 수익률을 JSON 형식으로 client에 반환
    res.json({
      samsung: {
        initialValue: initialSamsungValue,
        currentValue: currentSamsungValue,
        profit: samsungProfit,
        returnOfEquity: ((samsungProfit / initialSamsungValue) * 100).toFixed(2),
        amount: sh_ss_count
      },
      apple: {
        initialValue: initialAppleValue * latestExchangeRate,
        currentValue: currentAppleValue,
        profit: appleProfit,
        returnOfEquity: 
        ((appleProfit / (initialAppleValue * latestExchangeRate)) * 100).toFixed(2),
        amount: sh_ap_count
      },
      coin: {
        initialValue: initialCoinValue * latestExchangeRate,
        currentValue: currentCoinValue,
        profit: coinProfit,
        returnOfEquity: 
        ((coinProfit / (initialCoinValue * latestExchangeRate)) * 100).toFixed(2),
        amount: sh_bit_count
      },
      total: {
        totalInitialValue,
        totalCurrentValue,
        totalProfit,
        totalROE
      }
    });

    // 에러 발생시 로그 출력, 서버 500 오류 반환
  } catch (error) {
    console.error('Error fetching asset info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports = {
  getUserCapital,
  getUserTargetBudget,
  updateUserTargetBudget,
  getUserDeposit,
  getUserInstallmentSaving,
  getUserLoan,
  getUserStockInfo,
};
