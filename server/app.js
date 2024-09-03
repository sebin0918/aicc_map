const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const myAssetPlanerRoutes = require('./src/routes/myAssetPlanerRoutes');
const registerRoutes = require('./src/routes/RegisterRoutes');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken'); // JWT 모듈 추가
const bcrypt = require('bcryptjs'); // 비밀번호 비교를 위한 bcrypt 모듈 추가
const pool = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const stockChart = require("./src/routes/stockChartRoutes");


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET,  // 비밀 키를 환경 변수로 설정하면 더 안전합니다.
  resave: false,              // 세션이 수정되지 않았어도 저장할지 여부
  saveUninitialized: false,   // 초기화되지 않은 세션을 저장할지 여부
  cookie: { 
    maxAge: 1000 * 60 * 60,   // 1시간 동안 세션 유지
    httpOnly: true,           // 클라이언트에서 쿠키를 접근할 수 없도록 설정
    secure: false             // HTTPS를 사용하는 경우 true로 설정 (개발 중에는 false)
  }
}));

// 라우트 설정
app.use('/api/my-asset-planer', myAssetPlanerRoutes);
app.use('/api/register', registerRoutes);

// 간단한 DB 쿼리 예제 엔드포인트 server db test
app.use('/api/stock-chart', stockChart)
app.use('/api/auth', authRoutes);

// 로그인 처리
app.post('/login', async (req, res) => { 
  const { username, password } = req.body;

  try {
    // 1. 데이터베이스에서 사용자 정보 조회
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length > 0) {
      const user = rows[0];

      // 2. 비밀번호 검증
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // 3. JWT 토큰 생성
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token }); // JWT 토큰을 클라이언트에 반환
      } else {
        res.status(401).send('비밀번호가 일치하지 않습니다.');
      }
    } else {
      res.status(401).send('사용자 이름이 존재하지 않습니다.');
    }

    conn.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('서버 오류 발생');
  }
});

// JWT 기반 프로필 확인
app.get('/profile', (req, res) => {
  // 요청 헤더에서 Authorization 헤더의 값을 가져옵니다.
  const token = req.headers['authorization']?.split(' ')[1];

  if (token) {
    // JWT 토큰을 검증합니다.
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // 토큰이 유효하지 않은 경우
        return res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
      }

      // 토큰이 유효한 경우, 디코딩된 사용자 정보를 반환합니다.
      res.json({ message: `안녕하세요, ${decoded.username}님!`, user: decoded });
    });
  } else {
    // 토큰이 없는 경우
    res.status(401).json({ message: '로그인이 필요합니다.' });
  }
});


// DB 쿼리 엔드포인트
app.get('/db-test', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT 1 as val');
    res.json(rows);
  } catch (err) {
    res.status(500).send('Database connection error');
  } finally {
    if (conn) conn.end();
  }
});

// 서버 포트 설정
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
