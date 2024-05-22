import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function Ranking() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/travel/rankedlist/`, {
          params: {
            city: searchTerm,
            tag: searchTerm
          }
        });
        setPosts(response.data);
      } catch (error) {
        console.error('포스팅 데이터를 불러오는 데 실패했습니다', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/travel/rankeduser/`);
        setUsers(response.data);
      } catch (error) {
        console.error('유저 데이터를 불러오는 데 실패했습니다', error);
      }
    };

    fetchPosts();
    fetchUsers();
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="ranking-container">
      <div className="ranking-content">
        <div className="ranking-list ranking-posts">
          <h2>★ Best Review ★</h2>
          <input
            type="text"
            className="input-field"
            placeholder="도시 또는 태그 검색..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <ol>
            {posts.slice(0, 5).map((post, index) => (
              <li key={index} onClick={() => openModal(post)} className="ranked-post-item">
                <span>{index + 1}.</span> {post.Journal} {/* Display journal content instead of city */}
              </li>
            ))}
          </ol>
        </div>
        <div className="ranking-list ranking-users">
          <h2>★ Best Traveler ★</h2>
          <ol>
            {users.map((user, index) => (
              <li key={index}>
                <span>{index + 1}.</span> {user.name} - {user.total_likes} likes
              </li>
            ))}
          </ol>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <div className="modal-header">
              <h2>{selectedPost.City}</h2>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <li><strong>기간:</strong> {selectedPost.Date}</li>
                </div>
              </div>
              <li><strong>예산:</strong> {new Intl.NumberFormat('ko-KR').format(selectedPost.Money)} 원</li>
              <li><strong>태그:</strong> {selectedPost.Tag}</li>
              <textarea className="madal-review-field" value={selectedPost.Journal} readOnly></textarea>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ranking;
