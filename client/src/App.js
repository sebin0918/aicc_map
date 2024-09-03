import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';
import Login from './pages/Login';
import MyAssetPlaner from './pages/MyAssetPlaner';
import HouseHold from './pages/HouseHold';
import NewsCheck from './pages/NewsCheck';
import StockChart from './pages/StockChart';
import FAQ from './pages/FAQ';
import SignUp from './pages/SignUp';
import StockPrediction from './pages/StockPrediction';
import NewsTalk from './pages/NewsTalk'; 
import './App.css';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <div className="App">
      <AuthProvider> {/* AuthProvider로 애플리케이션 감싸기 */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path="/FAQ" element={<MainLayout><FAQ/></MainLayout>}/>
            {/* ProtectedRoute를 사용하여 로그인된 사용자만 접근할 수 있는 경로 */}
            <Route path="/mypage" element={<ProtectedRoute><MainLayout><MyPage /></MainLayout></ProtectedRoute>} />
            <Route path='/myassetplaner' element={<ProtectedRoute><MainLayout><MyAssetPlaner /></MainLayout></ProtectedRoute>} />
            <Route path='/household' element={<ProtectedRoute><MainLayout><HouseHold /></MainLayout></ProtectedRoute>} />
            <Route path='/newscheck' element={<ProtectedRoute><MainLayout><NewsCheck /></MainLayout></ProtectedRoute>} />
            <Route path='/newstalk' element={<ProtectedRoute><MainLayout><NewsTalk /></MainLayout></ProtectedRoute>} />
            <Route path='/stockchart' element={<ProtectedRoute><MainLayout><StockChart /></MainLayout></ProtectedRoute>} />
            <Route path='/stockprediction' element={<ProtectedRoute><MainLayout><StockPrediction /></MainLayout></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root')
);

export default App;
