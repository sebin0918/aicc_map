const pool = require('../config/database');
const smtpTransport = require('../config/email');

const bcrypt = require('bcryptjs');

const postCheckEmail = async (req, res) => {
  const checkingEmail = req.body.email;
  console.log(checkingEmail);
  
  let connection;
  try {
    connection = await pool.getConnection();
    const query = 'SELECT user_email FROM tb_user'
    const result = await connection.execute(query);
    console.log('Email쿼리적용 데이터:', result);

    const emailList = result.map(item => item.user_email);
    console.log(emailList);
    if (emailList.includes(checkingEmail)) {
      console.log('이미 가입된 이메일');
      res.status(200).json({ message: 'email impossible', id: result.insertId });
    } else {
      console.log('가입 가능한 이메일');
      res.status(200).json({ message: 'email possible', id: result.insertId });
    }
  } catch (err) {
      console.error('Email쿼리실행 에러:', err);
      res.status(500).send('서버 에러');
  } finally {
      if (connection) connection.release();  // 연결 반환. 풀로 되돌리기
  }
  
}


let vcode = '';
let returnEmail = '';
const postEmailCode = async (req, res) => {
  returnEmail = req.body.email;
  console.log(returnEmail);

  // vcode = Math.floor(Math.random() * 10000);
  vcode = Math.random().toString(36).substring(2, 6);
  console.log(vcode);

  const emailInfo = {
    from: 'lolanhani@gmail.com',
    to: returnEmail,
    subject: 'MAP 회원가입 인증코드',
    html: `<p>인증코드: <strong>${vcode}</strong></p>`
  };

  smtpTransport.sendMail(emailInfo, (err, response) => {
    if (err) {
      console.error('Send mail error:', err);
      res.json( {ok : false, msg: '인증코드 메일전송 실패'} );
    } else {
      console.log('Email sent:', response);
      res.json( {ok: true, msg: '인증코드 메일전송 성공', authNum: vcode} );
    }
    //smtpTransport.close();  // 연결종료 -> pool이 완전히 종료되어 문제발생
  });
}

const postConfirmCode = async (req, res) => {
  const returnCode = req.body.userconfirm
  console.log(vcode, returnCode);

  if (vcode === returnCode) {
    console.log('Code일치');
    res.status(200).json({ message: 'code possible'});
  } else {
    console.log('Code불일치');
    res.status(200).json({ message: 'code impossible'});
  }
}


const postUserRegister = async (req, res) => {

  const {
    user_email, user_password, user_name, user_birth_date,
    user_sex, user_bank_num, user_capital, user_permission
  } = req.body;  // user_mobile, user_loan, user_installment_saving, user_deposit

  console.log('회원가입 데이터:', req.body);
  console.log('작성이메일', req.body.user_email);
  console.log('확인이메일', returnEmail);

  if (req.body.user_email === returnEmail) {

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(user_password, 10); // 솔트 라운드를 10으로 설정

    let connection;
    try {
      connection = await pool.getConnection();
      const query = 'INSERT INTO tb_user (user_email, user_password, user_name, user_birth_date, user_sex, user_bank_num, user_capital, user_permission) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        // user_permission, user_loan, user_installment_saving, user_deposit, user_mobile,
      const result = await connection.execute(query, [
        user_email,
        hashedPassword, // 해싱된 비밀번호를 저장
        user_name,
        user_birth_date,
        user_sex,
        user_bank_num || null,
        user_capital || null,
        user_permission || 1
      ]);
          // user_loan, user_installment_saving, user_deposit
      console.log('회원가입 적용쿼리:', result);
      // connection.release();  // 연결반환. 풀로 되돌리기

      res.status(200).json({ message: 'User registered successfully!', id: result.insertId.toString() });
    } catch (err) {
        console.error('회원가입 쿼리실행 에러:', err);
        res.status(500).send('서버 에러');
    } finally {
        if (connection) connection.release();  // 연결 반환. 풀로 되돌리기
    }
  } else {
    res.status(200).json({ message: 'bad email'})
  }
};


module.exports = {
  postUserRegister,
  postCheckEmail,
  postEmailCode,
  postConfirmCode
};
