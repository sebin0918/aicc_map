const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '토큰이 필요합니다.' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }

    req.user = user; // 토큰에서 디코딩한 사용자 정보를 req.user에 저장
    next(); // 다음 미들웨어 또는 라우트로 이동
  });
};

module.exports = authenticateToken;
