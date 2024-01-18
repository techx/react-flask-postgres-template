import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import "./styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import "./index.css"

import Home from './components/Home'
import Entities from './components/Entities'
import DisclosureTracking from './components/DisclosureTracking'
import ExchangeRates from './components/ExchangeRates'
import Regulations from './components/Regulations'
import Navbar from './Navbar'

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Entities" element={<Entities />} />
        <Route path="/DisclosureTracking" element={<DisclosureTracking />} />
        <Route path="/ExchangeRates" element={<ExchangeRates />} />
        <Route path="/Regulations" element={<Regulations />} />
      </Routes>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <MantineProvider>
    <App />
  </MantineProvider>

);
