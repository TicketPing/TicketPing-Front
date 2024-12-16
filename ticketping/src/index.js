import React from 'react';
import ReactDOM from 'react-dom'; 
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from "./store";
import "./index.css";

const rootElement = document.getElementById('root');
ReactDOM.render(
  <BrowserRouter>
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>,
  rootElement
);
