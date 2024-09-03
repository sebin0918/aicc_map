import React, { useState, useEffect, useRef } from 'react';
import './Components_Styles.css';
import Chatbot_image from '../images/ai_chat_image.png';
import Chatbot_chart_image from '../images/chatbot_chart_sample.PNG';

function ChatBot() {
  const [modalOpen, setModalOpen] = useState(false);
  const modalBackground = useRef();
  return(
    <div className='ChatBot'>
      <img className='ChatBot-image' src={Chatbot_image}  onClick={() => setModalOpen(true)} />
      {
        modalOpen &&
        <div className='ChatBot-modal-container' ref={modalBackground} onClick={e => {
          if (e.target === modalBackground.current) {
            setModalOpen(false);
          }
        }}>
          <div className='ChatBot-modal-content'>
            <div className='ChatBot-modal-text'>
              <h5 className='ChatBot-question'>주식 비교 화면 보여줘!</h5>
              <h5 className='ChatBot-answer'><a href="/stockchart">여기 누르면 주식!</a></h5>
              <h5 className='ChatBot-question'>삼성과 나스닥의 비교 차트 보여줄 수 있어?</h5>
              <h5 className='ChatBot-answer'><img src={Chatbot_chart_image} /></h5>
              <h5 className='ChatBot-question'>가계부 화면 보여줘!</h5>
              <h5 className='ChatBot-answer'><a href="/myassetplaner">여기 누르면 가계부!</a></h5>
              <h5 className='ChatBot-question'>뉴스 보고싶어!</h5>
              <h5 className='ChatBot-answer'><a href="/newscheck">여기 누르면 뉴스!</a></h5>
              <h5 className='ChatBot-question'>FAQ 보여줘</h5>
              <h5 className='ChatBot-answer'><a href="/faq">여기 누르면 FAQ!</a></h5>
            </div>
            
            <input className='ChatBot-modal-input'></input>
            <button type='submit' className='ChatBot-modal-send-button'>SEND</button>
          </div>
        </div>
      }
    </div>
  );
}


export default ChatBot;
