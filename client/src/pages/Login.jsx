import React, { useState } from 'react'; 
import axios from 'axios'; 
import { useNavigate, Link } from 'react-router-dom'; 
import '../styles/Login.css'; 
import login_image from '../images/Login_image_1.png'; 
import login_logo from '../images/map_logo_login.png'; 
import signInButton from '../images/login_page_button.png'; 
import Footer from '../components/Footer';
import { useAuth } from '../AuthContext';

const Login = () => {
    // 이메일과 비밀번호 상태 관리
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태 관리
    const { login } = useAuth();
    const navigate = useNavigate(); 

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting:', { email, password }); // 제출된 데이터 확인
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            if (response.data.token) {
              login(response.data.token);
                navigate('/');
            } else {
                console.error('Login failed: No token received');
                setErrorMessage('Login failed: No token received');
            }
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            setErrorMessage(error.response ? error.response.data.msg : error.message); // 오류 메시지 설정
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-left">
                    <div className="illustration">
                        <img src={login_image} alt="illustration" />
                    </div>
                </div>
                <div className="login-right">
                    <div className="login-box">
                        <Link to="/">
                            <img src={login_logo} alt="MAP Logo" className="logo" />
                        </Link>
                        <h2>Welcome back !!!</h2>
                        <h1>Login</h1>
                        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* 오류 메시지 표시 */}
                        <form onSubmit={handleSubmit}>
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="test@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="*********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="forgot-password">
                                <Link to="/forgot-password">Forgot Password?</Link>
                            </div>
                            <button type="submit" className="sign-in-btn">
                                <img src={signInButton} alt="Sign In" />
                            </button>
                        </form>
                        <div className="sign-up">
                            <p>I don't have an account? <Link to="/signup">Sign up</Link></p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
