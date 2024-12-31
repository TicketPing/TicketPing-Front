import React from 'react';
import { Routes, Route } from 'react-router-dom'
import LoginRequiredRoute from './utils/LoginRequiredRoute';
import Main from './pages/Main';
import PerformanceDetail from './pages/PerformanceDetail'
import SelectSchedule from './pages/SelectSchedule';
import Seat from './pages/seat/Seat'
import Order from './pages/Order'
import AppLayout from './component/AppLayout';
import Login from './pages/Login';
import VerificationInfo from './pages/Join';
import MyPage from './pages/MyPage';
import NotFound from './pages/NotFound';
import Checkout from './pages/payment/Checkout';
import Success from './pages/payment/Success';
import Fail from './pages/payment/Fail';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path='/' element={<Main />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/join' element={<VerificationInfo />}></Route>
        <Route path='/mypage' element={<LoginRequiredRoute><MyPage /></LoginRequiredRoute>}></Route>
        <Route path='/performance/:id' element={<PerformanceDetail />} />
        <Route path='/performance/:id/schedule' element={<LoginRequiredRoute><SelectSchedule /></LoginRequiredRoute>} />
        <Route path='/performance/:performanceId/schedule/:scheduleId/seat' element={<LoginRequiredRoute><Seat /></LoginRequiredRoute>}></Route>
        <Route path='/performance/:performanceId/schedule/:scheduleId/order' element={<LoginRequiredRoute><Order /></LoginRequiredRoute>}></Route>
        <Route path='/checkout' element={<LoginRequiredRoute><Checkout /></LoginRequiredRoute>}></Route>
        <Route path='/success' element={<LoginRequiredRoute><Success /></LoginRequiredRoute>}></Route>
        <Route path='/fail' element={<LoginRequiredRoute><Fail /></LoginRequiredRoute>}></Route>
        <Route path='*' element={<NotFound />}></Route>
      </Routes>
    </AppLayout>
  );
}

export default App;