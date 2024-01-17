
import React from 'react';
import Navbar from './Navbar';
import './Template.css'; 

const TemplateFunc = ({ children }) => {
  return (
    <div className="layout-unique-container">
      <Navbar />
      <main className="layout-unique-main">
        {children}
      </main>
    
    </div>
  );
};
export default TemplateFunc;
