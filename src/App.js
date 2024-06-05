import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pages from '/pages';
import Result from '/pages/Result';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pages />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;
