import React, { useState } from 'react';
import Papa from 'papaparse';
import "./common.css"

const Dashboard = () => {
  const [tableData, setTableData] = useState([]);


  return (
    <div className="users-container">
        <div className="content-container">
        <header className="header">
            <h1>ESG Regulations</h1>
            <header className="logo"> 
            <img src="/nasdaq-logo.svg" alt="Nasdaq Logo" />
            </header> 
            
        </header>
        </div>
      
    </div>
  );
};

export default Dashboard;