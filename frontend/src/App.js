import React, { useState, useEffect } from 'react';
import './App.css';
import Write from './Write';
import Read from './Read';
import Ranking from './Ranking';
import Login from './Login'; // Login 컴포넌트 임포트
import airplaneimg from './assets/airplane.png'; // airplane 이미지 경로 확인

function App() {
  const [activeButton, setActiveButton] = useState('write');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const name = localStorage.getItem('name');
      const expiration = localStorage.getItem('expiration');
      const currentTime = new Date().getTime();

      if (name && expiration && currentTime > parseInt(expiration)) {
        localStorage.removeItem('name');
        localStorage.removeItem('expiration');
        setIsLoggedIn(false);
      } else if (name) {
        setIsLoggedIn(true);
      }
    };

    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 60000); // 매 분마다 로그인 상태 확인

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (name) => {
    const expirationTime = new Date().getTime() + 3600000; // 현재 시간으로부터 1시간 후
    localStorage.setItem('name', name);
    localStorage.setItem('expiration', expirationTime.toString());
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('name'); // 로컬 스토리지에서 사용자 이름 제거
    localStorage.removeItem('expiration'); // 만료 시간 제거
    window.location.reload(); // 페이지를 새로고침하여 로그인 상태를 리셋
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="mainbackground">
      <div>
        <label className='header-label'>Travelog</label>
        <img src={airplaneimg} alt="airplane" className="airplane-image" />
        <button className="headerbutton logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <div className="mainpage-wrapper">
        <header className="header">
          <div
            className={`headerbutton ${activeButton === 'write' ? 'activeButton' : ''}`}
            onClick={() => setActiveButton('write')}
          >
            Write
          </div>
          <div
            className={`headerbutton ${activeButton === 'read' ? 'activeButton' : ''}`}
            onClick={() => setActiveButton('read')}
          >
            Read
          </div>
          <div
            className={`headerbutton ${activeButton === 'ranking' ? 'activeButton' : ''}`}
            onClick={() => setActiveButton('ranking')}
          >
            Ranking
          </div>
        </header>
        <main className="mainarticle">
          {activeButton === 'write' && <Write />}
          {activeButton === 'read' && <Read />}
          {activeButton === 'ranking' && <Ranking />}
        </main>
      </div>
    </div>
  );
}

export default App;
