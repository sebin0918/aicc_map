import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/NewsTalk.css'; // 스타일 파일의 경로

import newsChatHeadIcon from '../images/news_chat_head_icon.png'; 
import NewsTalk_User_icon from '../images/NewsTalk_User_icon.png'; // 사용자 아이콘 이미지

import sendIcon from '../images/news_chat_post_icon.png'; 



function NewsTalk() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      const currentTime = new Date().toLocaleTimeString(); // 현재 시간
      // setMessages([...messages, { text: message, time: currentTime }]);
      setMessages([{ text: message, time: currentTime }, ...messages]);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="news-talk">
      <p>
        <img src={newsChatHeadIcon} alt="News Chat Icon" style={{ width: '65px', height: '50px', marginLeft: '10px' }} />
        <span>NewsTalk</span>
      </p>
      <div className="news-talk-messages">
        {messages.map((msg, index) => (
          <div key={index} className="news-talk-message-container">
            <div className="news-talk-message">
              <div>{msg.text}</div>
              <div className="news-talk-timestamp">{msg.time}</div>
            </div>
            <img src={NewsTalk_User_icon} alt="User Icon" className="news-talk-user-icon" />
          </div>
        ))}
      </div>


      <div className="news-talk-input-area">
        <input
          type="text"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder=""
        />
        <button className="news-talk-send-button" onClick={handleSendMessage}>
          <img src={sendIcon} alt="Send Icon" className="news-talk-send-icon" />
        </button>
      </div>
    </div>
  );
}

export default NewsTalk;
