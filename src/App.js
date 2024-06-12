import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pages from './pages';
import Show from './pages/Show';
import UnitSong from './pages/UnitSong';
import Result from './pages/UnitSong/Result';
import ResultShow from './pages/Show/Result';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pages />} />
        <Route path="/unit-song" element={<UnitSong />} />
        <Route path="/result" element={<Result />} />
        <Route path="/show" element={<Show />} />
        <Route path="/result-show" element={<ResultShow />} />
      </Routes>
    </Router>
  );
}

export default App;
