// client/src/layouts/MainLayout.jsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NavigationBar from '../components/NavigationBar';
import ChatBot from '../components/ChatBot';

const MainLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <NavigationBar />
      {children}
      <ChatBot />
      <Footer />
    </div>
  );
};

export default MainLayout;
