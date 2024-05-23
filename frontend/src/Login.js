import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import travelLogLogo from './assets/TravelLog_with_k8s_v2.webp'; // 이미지 경로 확인

function Login({ onLogin }) {
  const [name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/travel/login/`, {
        name: name,
        password: password
      });
      // 로컬 스토리지에 사용자 이름과 만료 시간을 저장합니다.
      const expirationTime = new Date().getTime() + 3600000; // 로그인 후 1시간 유효
      localStorage.setItem('name', response.data.user.name);
      localStorage.setItem('expiration', expirationTime.toString());
      alert('로그인 성공!');
      onLogin(response.data.user.name); // App 컴포넌트의 로그인 상태 업데이트 함수 호출
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setLoginError('사용자를 찾을 수 없습니다.');
      } else if (error.response && error.response.status === 400) {
        setLoginError('비밀번호가 틀렸습니다.');
      } else {
        setLoginError('오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form" autocomplete="off">
          <div className="login-input-group">
            <label htmlFor="name" className="input-label">ID</label>
            <input
              type="text"
              id="name"
              placeholder="ID 입력.."
              value={name}
              onChange={e => setUsername(e.target.value)}
              className="login-input-field"
              required
              autocomplete="off"
            />
          </div>
          <div className="login-input-group">
            <label htmlFor="password" className="input-label">PW</label>
            <input
              type="password"
              id="password"
              placeholder="PW 입력.."
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="login-input-field"
              required
              autocomplete="off"
            />
          </div>
          {loginError && <p className="login-error">{loginError}</p>}
          <button type="submit" className="login-button">로그인</button>
        </form>
        <img src={travelLogLogo} alt="TravelLog Logo" className="login-logo"/>
      </div>
    </div>
  );
}

export default Login;
