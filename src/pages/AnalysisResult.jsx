import React from 'react';
import { Link } from 'react-router-dom';

export default function AnalysisResult() {
  // Mock simulando o cálculo que virá do Back-end
  const mockResult = {
    verdict: "VIÁVEL", 
    certainty: 65.4,   
    contradiction: 10.2, 
    factors: [
      { name: 'Pressão Early Game', status: 'INVIÁVEL', gce: -20, gin: 5 },
      { name: 'Escaling', status: 'VIÁVEL', gce: 80, gin: 0 },
    ]
  };

  const getColor = (status) => status === 'VIÁVEL' ? 'green' : 'red';

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Veredito da Composição</h2>
      
      <div style={{ border: `3px solid ${getColor(mockResult.verdict)}`, padding: '20px', borderRadius: '10px', margin: '20px 0' }}>
        <h1 style={{ color: getColor(mockResult.verdict) }}>{mockResult.verdict}</h1>
        <p>Confiança do Time (Gce): <strong>{mockResult.certainty}%</strong></p>
        <p>Nível de Contradição (Gin): <strong>{mockResult.contradiction}%</strong></p>
      </div>

      <div style={{ textAlign: 'left' }}>
        <h3>Detalhamento</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {mockResult.factors.map((f, i) => (
            <li key={i} style={{ borderBottom: '1px solid #ccc', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
              <span>{f.name}</span>
              <span style={{ color: getColor(f.status), fontWeight: 'bold' }}>{f.status} ({f.gce}%)</span>
            </li>
          ))}
        </ul>
      </div>
      
      <Link to="/dashboard"><button style={{ marginTop: '20px' }}>Voltar</button></Link>
    </div>
  );
}