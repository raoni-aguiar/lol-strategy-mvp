import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VotingSession() {
  const navigate = useNavigate();
  
  // 1. Estado para o Inimigo (Contexto)
  const [enemyType, setEnemyType] = useState('TANK');

  // 2. Estado para os Status do Meu Time (0 a 10)
  const [stats, setStats] = useState({
    DPS: 5,
    BURST: 5,
    ENGAGE: 5,
    PEEL: 5
  });

  const handleStatChange = (key, value) => {
    setStats(prev => ({ ...prev, [key]: parseInt(value) }));
  };

  const submitAnalysis = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enemyType, stats })
      });

      const data = await response.json();
      
      // Salva resultado e vai para tela de resultados
      localStorage.setItem('lastAnalysis', JSON.stringify(data));
      navigate('/result/1'); // ID fictício por enquanto
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="voting-container" style={{maxWidth: '600px', margin: '0 auto', padding: '20px'}}>
      
      {/* SELEÇÃO DO INIMIGO (CONTEXTO) */}
      <div className="factor-card" style={{padding: '20px', marginBottom: '30px', border: '2px solid #ff4e50'}}>
        <h3 style={{color: '#ff4e50', marginTop: 0}}>Passo 1: Quem é o Inimigo?</h3>
        <label style={{display: 'block', marginBottom: '10px'}}>Estilo da Comp Adversária:</label>
        <select 
          value={enemyType} 
          onChange={(e) => setEnemyType(e.target.value)}
          style={{width: '100%', padding: '15px', fontSize: '16px', backgroundColor: '#1e2328', color: '#fff'}}
        >
          <option value="TANK">🛡️ Tank / Hard Engage (Muito HP e CC)</option>
          <option value="POKE">🏹 Poke / Siege (Dano de longe, frágeis)</option>
          <option value="ASSASSIN">🗡️ Assassinos / Pick-off (Explosão)</option>
          <option value="SPLIT">🔥 Split Push (Focam torres laterais)</option>
        </select>
      </div>

      {/* AVALIAÇÃO DO MEU TIME */}
      <h3 style={{color: 'var(--lol-gold)'}}>Passo 2: Avalie Sua Composição (0 a 10)</h3>
      
      <div className="factor-card" style={{padding: '20px'}}>
        
        {/* SLIDER 1: DPS */}
        <div style={{marginBottom: '20px'}}>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <label>DPS (Derreter Tanques)</label>
            <span style={{color: 'var(--lol-cyan)'}}>{stats.DPS}/10</span>
          </div>
          <input type="range" min="0" max="10" value={stats.DPS} className="slider-mu"
                 onChange={(e) => handleStatChange('DPS', e.target.value)} />
          <small style={{color: '#666'}}>Ex: Vayne, Cassiopeia, Azir</small>
        </div>

        {/* SLIDER 2: BURST */}
        <div style={{marginBottom: '20px'}}>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <label>Burst (Explosão Instantânea)</label>
            <span style={{color: 'var(--lol-cyan)'}}>{stats.BURST}/10</span>
          </div>
          <input type="range" min="0" max="10" value={stats.BURST} className="slider-mu"
                 onChange={(e) => handleStatChange('BURST', e.target.value)} />
          <small style={{color: '#666'}}>Ex: Syndra, Zed, Annie</small>
        </div>

        {/* SLIDER 3: ENGAGE */}
        <div style={{marginBottom: '20px'}}>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <label>Hard Engage (Forçar Luta)</label>
            <span style={{color: 'var(--lol-cyan)'}}>{stats.ENGAGE}/10</span>
          </div>
          <input type="range" min="0" max="10" value={stats.ENGAGE} className="slider-mu"
                 onChange={(e) => handleStatChange('ENGAGE', e.target.value)} />
          <small style={{color: '#666'}}>Ex: Malphite, Ornn, Leona</small>
        </div>

        {/* SLIDER 4: PEEL */}
        <div style={{marginBottom: '20px'}}>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <label>Peel / Desengage (Proteção)</label>
            <span style={{color: 'var(--lol-cyan)'}}>{stats.PEEL}/10</span>
          </div>
          <input type="range" min="0" max="10" value={stats.PEEL} className="slider-mu"
                 onChange={(e) => handleStatChange('PEEL', e.target.value)} />
          <small style={{color: '#666'}}>Ex: Janna, Braum, Lulu</small>
        </div>

      </div>

      <button onClick={submitAnalysis} className="btn-finish" style={{marginTop: '20px', width: '100%'}}>
        CALCULAR VIABILIDADE
      </button>
    </div>
  );
}