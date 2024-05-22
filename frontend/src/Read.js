import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import airplaneimg from './assets/airplane.png';
import budget from './assets/budget.png';
import period from './assets/period.png';
import tag from './assets/tag.png';

function Read() {
  const [data, setData] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likeMessage, setLikeMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/travel/`);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch data.', error);
      }
    };
    fetchData();
  }, []);

  const openModal = (journal) => {
    setSelectedJournal(journal);
    setIsModalOpen(true);
    setLikeMessage('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLike = async (travelId) => {
    const username = localStorage.getItem('name');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/travel/${travelId}/like/`, {
        name: username
      });
      if (response.data && response.data.likes_count !== undefined) {
        const updatedData = data.map(item =>
          item.TravelID === travelId ? { ...item, likes_count: response.data.likes_count } : item
        );
        setData(updatedData);
        ;
      } else {
        setLikeMessage('좋아요를 눌렀습니다!');
      }
    } catch (error) {
      if (error.response) {
        setLikeMessage(error.response.data.message);
      } else {
        setLikeMessage('좋아요 처리 중 문제가 발생했습니다.');
      }
    }
  };


  return (
    <div className="read-container">
      {data.map((item, index) => (
        <div key={index} className="card" onClick={() => openModal(item)}>
          <img src={airplaneimg} className="card-image" alt='airplane' />
          <div className="card-title">{item.City}</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={budget} alt='budget' className="card-descriptionimg" />
            <div style={{ width: "20px" }}></div>
            <div style={{ fontSize: '20px', textAlign: 'center', fontWeight: 'bold', marginRight: '20px' }}>
              {new Intl.NumberFormat('ko-KR').format(item.Money)} 원
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={period} alt='period' style={{ width: '40px' }} />
            <div style={{ width: "22px" }}></div>
            <div style={{ fontSize: '15px', textAlign: 'center', fontWeight: 'bold', marginRight: '20px' }}>{item.Date}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={tag} alt='tag' className="card-descriptionimg" />
            <div style={{ width: "10px" }}></div>
            <div style={{ fontSize: '17px', textAlign: 'center', fontWeight: 'bold' }}>{item.Tag}</div>
          </div>
        </div>
      ))}
      {isModalOpen && (
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <div className="modal-header">
              <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>{selectedJournal.City}</h2>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <li><strong>기간:</strong> {selectedJournal.Date}</li>
                </div>
                <button className="like-button" onClick={() => handleLike(selectedJournal.TravelID)}>
                </button>
              </div>
              <li><strong>예산:</strong> {new Intl.NumberFormat('ko-KR').format(selectedJournal.Money)} 원</li>
              <li><strong>태그:</strong> {selectedJournal.Tag}</li>
              <textarea className="madal-review-field" value={selectedJournal.Journal} readOnly></textarea>
              {/* 메시지 표시 부분 추가 */}
              {likeMessage && <div style={{ color: 'red', marginTop: '10px' }}>{likeMessage}</div>}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Read;
