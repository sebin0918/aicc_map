const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide email and password' });
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM tb_user WHERE user_email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ msg: 'Invalid email or password' });
        }

        const user = rows[0];

        // 비밀번호 필드가 존재하는지 확인
        if (!user.user_password) {
            return res.status(500).json({ msg: 'Database error', error: 'Password not found in database' });
        }

        const isMatch = await bcrypt.compare(password, user.user_password);

        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true });
        return res.json({ msg: 'Login successful', token });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ msg: 'Database error', error: err.message });
    } finally {
        if (conn) conn.release();
    }
};
