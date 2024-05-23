import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// XSS 취약점 예제
const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get('name');
if (userName) {
  const xssElement = document.createElement('div');
  xssElement.innerHTML = `환영합니다, ${userName}`; // 취약한 부분
  document.body.appendChild(xssElement);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
