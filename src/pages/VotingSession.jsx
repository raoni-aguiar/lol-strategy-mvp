import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const factorsList = [
  { id: 'PVE01', name: 'Pressão Early Game', stats: 'WinRate < 25min: 48%' },
  { id: 'PVE02', name: 'Escaling (Late Game)', stats: 'WinRate > 35min: 62%' },
  { id: 'PVE03', name: 'Controle de Objetivos', stats: 'Dragons/game: 2.5' },
  { id: 'PVE04', name: 'Sinergia da Comp', stats: 'Combo Yasuo + Diana' },
  { id: 'PVE05', name: 'Risco de Counter-Pick', stats: 'Adversário joga de Malphite' }
];

export default function VotingSession() {
  const [votes, setVotes] = useState({});
  const navigate = useNavigate();

  const handleSliderChange = (factorId, type, value) => {
    setVotes(prev => ({
      ...prev,
      [factorId]: { ...prev[factorId], [type]: parseInt(value) }
    }));
  };

  const submitVotes = () => {
    console.log("Votos enviados:", votes);
    alert("Análise enviada! (Lógica Paraconsistente será aplicada no Back-end)");
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Análise Tática</h2>
      
      {factorsList.map(factor => (
        <div key={factor.id} style={{ marginBottom: '20px', border: '1px solid #444', padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3>{factor.name}</h3>
            <span style={{ background: '#eee', color: '#333', padding: '2px 8px', borderRadius: '4px' }}>{factor.stats}</span>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
            {/* INPUT MU (CERTEZA) */}
            <div style={{ flex: 1 }}>
              <label>Viabilidade (Certeza): {votes[factor.id]?.mu || 0}%</label><br/>
              <input 
                type="range" min="0" max="100" style={{ width: '100%' }}
                onChange={(e) => handleSliderChange(factor.id, 'mu', e.target.value)} 
              />
            </div>

            {/* INPUT LAMBDA (DÚVIDA) */}
            <div style={{ flex: 1 }}>
              <label>Risco (Incerteza): {votes[factor.id]?.lambda || 0}%</label><br/>
              <input 
                type="range" min="0" max="100" style={{ width: '100%' }}
                onChange={(e) => handleSliderChange(factor.id, 'lambda', e.target.value)} 
              />
            </div>
          </div>
        </div>
      ))}

      <button onClick={submitVotes} style={{ padding: '15px', width: '100%', fontSize: '16px', marginTop: '20px' }}>
        Finalizar Análise
      </button>
    </div>
  );
}