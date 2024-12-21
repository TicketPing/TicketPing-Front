import React from 'react';
import { Routes, Route } from 'react-router-dom'
import LoginRequiredRoute from './utils/LoginRequiredRoute';
import Main from './pages/Main';
import PerformanceDetail from './pages/PerformanceDetail'
import AppLayout from './component/AppLayout';
import Login from './pages/Login';
import VerificationInfo from './pages/Join';
import MyPage from './pages/MyPage';
import NotFound from './pages/NotFound';
import SelectSchedule from './pages/SelectSchedule';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path='/' element={<Main />}></Route>
        <Route path='/mypage' element={<LoginRequiredRoute><MyPage /></LoginRequiredRoute>}></Route>
        <Route path="/performance/:id" element={<PerformanceDetail />} />
        <Route path='/login' element={<Login />}></Route>
        <Route path='/join' element={<VerificationInfo />}></Route>
        <Route path="/performance/:id/schedule" element={<LoginRequiredRoute><SelectSchedule /></LoginRequiredRoute>} />
        <Route path='*' element={<NotFound />}></Route>
      </Routes>
    </AppLayout>
  );
}

export default App;