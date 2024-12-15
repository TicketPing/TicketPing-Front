import React from 'react';
import { Routes, Route} from 'react-router-dom'
import Main from './pages/Main';
import Nav from "./component/Nav";
import Login from './pages/Login';
import VerificationInfo from './pages/Join';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="App">
      <div>
        <Nav/>
        <Routes>
          <Route path='/' element={<Main />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/join' element={<VerificationInfo />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;