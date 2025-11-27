import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VotingSession from './pages/VotingSession';
import AnalysisResult from './pages/AnalysisResult';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vote/:matchId" element={<VotingSession />} />
        <Route path="/result/:matchId" element={<AnalysisResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;