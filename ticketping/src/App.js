import React from 'react';
import { Routes, Route } from 'react-router-dom'
import Main from './pages/Main';
import PerformanceDetail from './pages/PerformanceDetail'
import AppLayout from './component/AppLayout';
import Login from './pages/Login';
import VerificationInfo from './pages/Join';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path='/' element={<Main />}></Route>
        <Route path="/performance/:id" element={<PerformanceDetail />} />
        <Route path='/login' element={<Login />}></Route>
        <Route path='/join' element={<VerificationInfo />}></Route>
        <Route path='*' element={<NotFound />}></Route>
      </Routes>
    </AppLayout>
  );
}

export default App;