// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../styles/MyPage.css';
// import gendar_male from '../images/gendar_male_icon.png';
// import gendar_female from '../images/gendar_female_icon.png';

// // ConfirmationModal 컴포넌트를 MyPage 외부에 선언
// const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="mypage-modal-container">
//       <div className="mypage-modal">
//         <h2>정말로 회원을 탈퇴하시겠습니까?</h2>
//         <p>Are you sure to cancel your membership?</p>
//         <button className="mypage-modal-button" onClick={onConfirm}>네, 탈퇴합니다</button>
//         <button className="mypage-modal-button mypage-cancel-button" onClick={onCancel}>아니오</button>
//       </div>
//     </div>
//   );
// };

// function MyPage() {
//   const [formData, setFormData] = useState({
//     name: '',
//     gender: '',
//     email: '',
//     confirmEmail: '',
//     password: '',
//     confirmPassword: '',
//     verificationCode: '',
//     mobile: '',
//     accountNo: '',
//     holdingAsset: '',
//   });

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [error, setError] = useState('');

//   // 사용자 데이터 로드
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem('authToken');
//         const response = await axios.get('/api/profile', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setFormData({
//           ...formData,
//           name: response.data.user.name,
//           gender: response.data.user.gender,
//           email: response.data.user.email,
//           mobile: response.data.user.mobile,
//           accountNo: response.data.user.accountNo,
//           holdingAsset: response.data.user.holdingAsset,
//         });
//       } catch (error) {
//         setError('프로필 정보를 불러오는 중 오류가 발생했습니다.');
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('authToken');
//       await axios.put('/api/profile', formData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       alert('프로필이 성공적으로 업데이트되었습니다.');
//     } catch (error) {
//       setError('프로필 업데이트 중 오류가 발생했습니다.');
//     }
//   };

//   const handleButtonClick = (field) => {
//     if (field === 'Account Deletion') {
//       setIsModalOpen(true);
//     } else {
//       alert(`Change ${field}`);
//     }
//   };

//   const handleConfirm = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       await axios.delete('/api/profile', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       alert('회원 탈퇴 완료');
//       setIsModalOpen(false);
//       // 로그아웃 처리 및 페이지 리디렉션 추가 가능
//     } catch (error) {
//       setError('회원 탈퇴 중 오류가 발생했습니다.');
//     }
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="mypage-container">
//       <div className="mypage-white-box">
//         <p>Check your information with MAP!</p>
//         {error && 
//           <p className="mypage-profile-error-message">{error}</p>
//           }
//         <form id="user-form" onSubmit={handleSubmit}>
//           <div className="mypage-form-row">
//             <div className="mypage-form-column">
//               <div className="mypage-form-field">
//                 <label className="mypage-label" htmlFor="name"><span>*</span> Name:</label>
//                 <input className="mypage-form-input" type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
//                 <button className="mypage-change-button" type="button" onClick={() => handleButtonClick('Name')}>변경</button>
//               </div>

//               <div className="mypage-form-field">
//                 <label className="mypage-label" htmlFor="email"><span>*</span> Email Id:</label>
//                 <input className="mypage-form-input" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
//                 <button className="mypage-change-button" type="button" onClick={() => handleButtonClick('Email Id')}>변경</button>
//               </div>

//               <div className="mypage-form-field">
//                 <label className="mypage-label" htmlFor="confirm-email"><span>*</span> Email Confirm:</label>
//                 <input className="mypage-form-input-email" type="email" id="confirm-email" name="confirmEmail" value={formData.confirmEmail} onChange={handleChange} required />
//                 <button className="mypage-change-button-email" type="button" onClick={() => handleButtonClick('Email Confirm')}>코드발송</button>
//                 <button className="mypage-change-button-email" type="button" onClick={() => handleButtonClick('Email Confirm')}>인증확인</button>
//               </div>

//               <div className="mypage-form-field">
//                 <label className="mypage-label" htmlFor="password"><span>*</span> Password:</label>
//                 <input className="mypage-form-input" type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
//                 <button className="mypage-change-button" type="button" onClick={() => handleButtonClick('Password')}>변경</button>
//               </div>

//               <div className="mypage-form-field">
//                 <label className="mypage-label" htmlFor="confirm-password"><span>*</span> Confirm Password:</label>
//                 <input className="mypage-form-input" type="password" id="confirm-password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
//               </div>
//             </div>

//             <div className="mypage-form-column">
//               <div className="mypage-form-field">
//                 <label className="mypage-label"><span>*</span> Gender:</label>
//                 <div className="mypage-radio-group">
//                   <label><input className="mypage-radio-input" type="radio" name="gender" value="Male" onChange={handleChange} required /> Male</label>
//                   <img src={gendar_male} alt="Male" style={{ width: '15px', height: '18px', marginRight: '5px' }} />
//                   <label><input className="mypage-radio-input" type="radio" name="gender" value="Female" onChange={handleChange} required /> Female</label>
//                   <img src={gendar_female} alt="Female" style={{ width: '15px', height: '18px', marginRight: '5px' }} />
//                 </div>
//               </div>

//               <div className="mypage-form-field">
//                 <label className="mypage-label" htmlFor="birth-date"><span>*</span> Birth Date:</label>
//                 <input className="mypage-form-input" type="text" id="birth-date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
//                 <button className="mypage-change-button" type="button" onClick={() => handleButtonClick('Birth Date')}>변경</button>
//               </div>

//               <div className="mypage-form-field">
//                 <label className="mypage-label" htmlFor="mobile"><span>*</span> Mobile No.:</label>
//                 <input className="mypage-form-input" type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} required />
//                 <button className="mypage-change-button" type="button" onClick={() => handleButtonClick('Mobile No.')}>변경</button>
//               </div>

//               <div className="mypage-form-field">
//                 <label className="mypage-label" htmlFor="account-no">Account No.:</label>
//                 <input className="mypage-form-input" type="text" id="account-no" name="accountNo" value={formData.accountNo} onChange={handleChange} required />
//                 <button className="mypage-change-button" type="button" onClick={() => handleButtonClick('Account No.')}>변경</button>
//               </div>

//               <div className="mypage-form-field">
//                 <label className="mypage-label" htmlFor="holding-asset">Holding Asset:</label>
//                 <input className="mypage-form-input" type="text" id="holding-asset" name="holdingAsset" value={formData.holdingAsset} onChange={handleChange} required />
//                 <button className="mypage-change-button" type="button" onClick={() => handleButtonClick('Holding Asset')}>변경</button>
//               </div>
//             </div>
//           </div>

//           <button className="mypage-submit-button" type="submit">
//             <span className="mypage-text-submit">변경사항 확정하기</span>
//           </button>

//           <button className="mypage-text-only-right-button" type="button" onClick={() => setIsModalOpen(true)}>회원 탈퇴</button>
//           {/* <button className="mypage-text-only-left-button" type="button" onClick={() => alert('비밀번호가 일치합니다.')}>비밀번호가 일치합니다.</button> */}
//         </form>
//       </div>
      
//       {/* Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={isModalOpen}
//         onConfirm={handleConfirm}
//         onCancel={handleCancel}
//       />
//     </div>
//   );
// }

// export default MyPage;

// 유경이 작성한 화면만 보이는걸 먼저 함. 위는 token화를 한 화면 
import React, { useState } from 'react';
import '../styles//MyPage.css';
import gendar_male from '../images/gendar_male_icon.png';
import gendar_female from '../images/gendar_female_icon.png';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="mypage-modal-container">
      <div className="mypage-modal">
        <h2>정말로 회원을 탈퇴하시겠습니까?</h2>
        <p>Are you sure to cancel your membership?</p>
        <button className="mypage-modal-button" onClick={onConfirm}>네, 탈퇴합니다</button>
        <button className="mypage-modal-button mypage-cancel-button" onClick={onCancel}>아니오</button>
      </div>
    </div>
  );
};

function MyPage() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    mobile: '',
    accountNo: '',
    holdingAsset: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert(JSON.stringify(formData, null, 2));
  };

  const handleButtonClick = (field) => {
    if (field === 'Account Deletion') {
      setIsModalOpen(true);
    } else {
      alert(`Change ${field}`);
    }
  };

  const handleConfirm = () => {
    alert('회원 탈퇴 완료');
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mypage-container">
      <div className="mypage-white-box">
        <p>Check your information with MAP!</p>
        <form id="user-form" onSubmit={handleSubmit}>
          <div className="mypage-form-row">
            <div className="mypage-form-column">
              <div className="mypage-form-field">
                <label className="mypage-label" htmlFor="name"><span>*</span> Name:</label>
                <input className="mypage-form-input" type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                <button className="mypage-change-button" type="button" onClick={() => handleButtonClick('Name')}>변경</button>
              </div>

              <div className="mypage-form-field">
                <label className="mypage-label" htmlFor="email"><span>*</span> Email Id:</label>
                <input className="mypage-form-input" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                <button className="mypage-change-button" type="button" onClick={() => handleButtonClick('Email Id')}>변경</button>
              </div>

              <div className="mypage-form-field">
                <label className="mypage-label" htmlFor="confirm-email"><span>*</span> Email Confirm:</label>
                <input className="mypage-form-input-email" type="email" id="confirm-email" name="confirmEmail" value={formData.confirmEmail} onChange={handleChange} required />
                <button className="mypage-change-button-email" type="button" onClick={() => handleButtonClick('Email Confirm')}>코드발송</button>
                <button className="mypage-change-button-email" type="button" onClick={() => handleButtonClick('Email Confirm')}>인증확인</button>
             </div>


              <div className="mypage-form-field">
                <label className="mypage-label" htmlFor="password"><span>*</span> Password:</label>
                <input className="mypage-form-input" type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                <button className="mypage-change-button" type="button" onClick={() => handleButtonClick('Password')}>변경</button>
              </div>

              <div className="mypage-form-field">
                <label className="mypage-label" htmlFor="confirm-password"><span>*</span> Confirm Password:</label>
                <input className="mypage-form-input" type="password" id="confirm-password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            <div className="mypage-form-column">
              <div className="mypage-form-field">
                <label className="mypage-label"><span>*</span> Gender:</label>
                <div className="mypage-radio-group">
                  <label><input className="mypage-radio-input" type="radio" name="gender" value="Male" onChange={handleChange} required /> Male</label>
                  <img src={gendar_male} alt="Male" style={{ width: '15px', height: '18px', marginRight: '5px' }} />
                  <label><input className="mypage-radio-input" type="radio" name="gender" value="Female" onChange={handleChange} required /> Female</label>
                  <img src={gendar_female} alt="Female" style={{ width: '15px', height: '18px', marginRight: '5px' }} />
                </div>
              </div>

              <div className="mypage-form-field">
                <label className="mypage-label" htmlFor="birth-date"><span>*</span> Birth Date:</label>
                <input className="mypage-form-input" type="text" id="birth-date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
                <button className="mypage-change-button" type="button" onClick={() => handleButtonClick('Birth Date')}>변경</button>
              </div>

              <div className="mypage-form-field">
                <label className="mypage-label" htmlFor="mobile"><span>*</span> Mobile No.:</label>
                <input className="mypage-form-input" type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} required />
                <button className="mypage-change-button" type="button" onClick={() => handleButtonClick('Mobile No.')}>변경</button>
              </div>

              <div className="mypage-form-field">
                <label className="mypage-label" htmlFor="account-no">Account No.:</label>
                <input className="mypage-form-input" type="text" id="account-no" name="accountNo" value={formData.accountNo} onChange={handleChange} required />
                <button className="mypage-change-button" type="button" onClick={() => handleButtonClick('Account No.')}>변경</button>
              </div>

              <div className="mypage-form-field">
                <label className="mypage-label" htmlFor="holding-asset">Holding Asset:</label>
                <input className="mypage-form-input" type="text" id="holding-asset" name="holdingAsset" value={formData.holdingAsset} onChange={handleChange} required />
                <button className="mypage-change-button" type="button" onClick={() => handleButtonClick('Holding Asset')}>변경</button>
              </div>
            </div>
          </div>

          <button className="mypage-submit-button" type="submit">
            <span className="mypage-text-submit">변경사항 확정하기</span>
          </button>

          <button className="mypage-text-only-right-button" type="button" onClick={() => setIsModalOpen(true)}>회원 탈퇴</button>
          <button className="mypage-text-only-left-button" type="button" onClick={() => alert('비밀번호가 일치합니다.')}>비밀번호가 일치합니다.</button>
        </form>
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default MyPage;