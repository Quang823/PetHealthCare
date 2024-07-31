import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.scss';
import 'react-toastify/dist/ReactToastify.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
// import '@fontawesome/fontawesome-free/css/all.min.css';
import { UserProvider } from './Context/UserContext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UserProvider>
);

reportWebVitals();
