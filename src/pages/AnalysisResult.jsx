import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AnalysisResult() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Carrega o último resultado salvo
    const data = JSON.parse(localStorage.getItem('lastAnalysis'));
    setResult(data);
  }, []);

  if (!result) return <div style={{padding: '20px'}}>Carregando...</div>;

  // Função para cor do Tier
  const getTierColor = (tier) => {
    if (tier.includes('S')) return '#ffaa00'; // Ouro/Lendário
    if (tier.includes('A')) return '#0ac8b9'; // Ciano/Bom
    if (tier.includes('B')) return '#ffffff'; // Branco/Normal
    return '#ff4e50'; // Vermelho/Ruim
  };

  return (
    <div className="result-container" style={{padding: '20px', maxWidth: '600px', margin: '0 auto'}}>
      
      <h3 style={{textAlign: 'center', color: '#888'}}>VS {result.enemyArchetype}</h3>
      
      {/* PLACA DO TIER */}
      <div style={{
        border: `3px solid ${getTierColor(result.tier)}`,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '30px',
        textAlign: 'center',
        borderRadius: '10px',
        marginBottom: '30px',
        boxShadow: `0 0 20px ${getTierColor(result.tier)}40`
      }}>
        <h1 style={{fontSize: '3em', margin: 0, color: getTierColor(result.tier)}}>
          {result.tier}
        </h1>
        <p style={{margin: '10px 0 0 0', fontSize: '1.2em'}}>Score: {result.finalScore}</p>
      </div>

      {/* DETALHAMENTO MATEMÁTICO */}
      <div className="match-card" style={{padding: '20px'}}>
        <h3>Por que esse resultado?</h3>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{borderBottom: '1px solid #444', color: '#888'}}>
              <th style={{textAlign: 'left', padding: '10px'}}>Atributo</th>
              <th style={{textAlign: 'center'}}>Sua Nota</th>
              <th style={{textAlign: 'center'}}>Peso (Inimigo)</th>
              <th style={{textAlign: 'right'}}>Total</th>
            </tr>
          </thead>
          <tbody>
            {result.details.map((item, index) => (
              <tr key={index} style={{borderBottom: '1px solid #333'}}>
                <td style={{padding: '10px', fontWeight: 'bold'}}>{item.stat}</td>
                <td style={{textAlign: 'center', color: '#aaa'}}>{item.baseValue}</td>
                <td style={{textAlign: 'center'}}>
                  <span style={{
                    color: item.multiplier > 1 ? '#0ac8b9' : (item.multiplier < 1 ? '#ff4e50' : '#fff'),
                    fontWeight: 'bold'
                  }}>
                    x{item.multiplier}
                  </span>
                </td>
                <td style={{textAlign: 'right', color: 'var(--lol-gold)'}}>{item.finalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/dashboard">
        <button style={{width: '100%', marginTop: '20px'}}>Voltar ao Dashboard</button>
      </Link>
    </div>
  );
}