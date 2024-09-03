import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth  } from '../AuthContext'; // useAuth 사용
import './Components_Styles.css';
import logo from '../images/map_logo_all_page.png';
import accountIcon from '../images/account_icon.png'; // 마이페이지 아이콘
import logoutIcon from '../images/logout_icon.png'; // 로그아웃 아이콘
import loginIcon from '../images/login_icon.png'; // 로그인 이미지
import signupIcon from '../images/login_page_button.png'; // 회원가입 이미지


const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMouseEnter = (menu) => {
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to ="/">
        <img src={logo} alt="MAP Logo" className="logo" />
        </Link>
        <nav>
          <ul>
            <li
              onMouseEnter={() => handleMouseEnter('MAP')}
              onMouseLeave={handleMouseLeave}
              className={activeMenu === 'MAP' ? 'hovered' : ''}
            >
              <Link to="/myassetplaner" className="nav-link">MAP</Link>
              <ul className={activeMenu === 'MAP' ? 'dropdown' : ''}>
                <li><Link to="/myassetplaner" className="nav-link">My Asset Planner</Link></li>
                <li><Link to ="/household" className="nav-link">가계부</Link></li>
              </ul>
            </li>
            <li
              onMouseEnter={() => handleMouseEnter('주식')}
              onMouseLeave={handleMouseLeave}
              className={activeMenu === '주식' ? 'hovered' : ''}
            >
              <Link to="/stockchart" className="nav-link">주식</Link>
              <ul className={activeMenu === '주식' ? 'dropdown' : ''}>
                <li><Link to="/stockchart" className="nav-link">주식 비교</Link></li>
                <li><Link to="/stockprediction" className="nav-link">주식 예측</Link></li>
                
              </ul>
            </li>
            <li
              onMouseEnter={() => handleMouseEnter('뉴스')}
              onMouseLeave={handleMouseLeave}
              className={activeMenu === '뉴스' ? 'hovered' : ''}
            >
              <Link to="/newscheck" className="nav-link">뉴스</Link>
              <ul className={activeMenu === '뉴스' ? 'dropdown' : ''}>
                <li><Link to="/newscheck" className="nav-link">경제 뉴스</Link></li>
                <li><Link to ="/newstalk" className="nav-link">통합 채팅방 </Link></li>
              </ul>
            </li>
            <li
              onMouseEnter={() => handleMouseEnter('고객서비스')}
              onMouseLeave={handleMouseLeave}
              className={activeMenu === '고객서비스' ? 'hovered' : ''}
            >
              <Link to="/faq" className="nav-link">고객서비스</Link>
              <ul className={activeMenu === '고객서비스' ? 'dropdown' : ''}>
                <li><Link to="/faq" className="nav-link">FAQ</Link></li>
              </ul>
            </li>
          </ul>
        </nav>
        <div className="auth-buttons">
          {isAuthenticated  ? (
            <>
              <button onClick={logout} className="logout-button">
              <img src={logoutIcon} alt="Logout" style={{ width: '80px', height: '30px' }} />
              </button>
              <Link to="/mypage">
                <img src={accountIcon} alt="My Page" style={{ width: '35px', height: '35px' }} />
              </Link>
            </>
          ) : (
            <>
              <Link to = "/login">
                <button className="login-button">로그인</button>
              </Link>
              <Link to = "/signup">
                <button className="signup-button">회원가입</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
