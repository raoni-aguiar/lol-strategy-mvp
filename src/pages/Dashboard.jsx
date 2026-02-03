import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

export default function Dashboard() {
  const [matches, setMatches] = useState([]); // Lista de partidas
  const [user, setUser] = useState(null);     // Usuário logado
  
  // States para o formulário de criação (apenas Coach usa)
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMatch, setNewMatch] = useState({ title: '', desc: '' });

  // Carrega os dados assim que a tela abre
  useEffect(() => {
    // 1. Recupera o usuário salvo no Login
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    if (loggedUser) {
      setUser(loggedUser);
    }

    // 2. Busca as partidas no Banco de Dados
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${API_URL}/api/matches`);
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error("Erro ao buscar partidas:", error);
    }
  };

  // Função para o Coach criar uma nova análise
  const handleCreateMatch = async (e) => {
    e.preventDefault();
    
    if (!newMatch.title || !newMatch.desc) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newMatch.title, 
          description: newMatch.desc 
        })
      });

      if (response.ok) {
        alert("Nova estratégia criada com sucesso!");
        setShowCreateForm(false);
        setNewMatch({ title: '', desc: '' }); // Limpa o formulário
        fetchMatches(); // Atualiza a lista na tela
      } else {
        alert("Erro ao criar estratégia.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* CABEÇALHO */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h2>Salas de Estratégia</h2>
        {user && (
          <div style={{textAlign: 'right'}}>
            <span style={{color: 'var(--lol-gold)', fontWeight: 'bold', display: 'block'}}>
              {user.name}
            </span>
            <span style={{fontSize: '0.8em', color: '#666', textTransform: 'uppercase'}}>
              {user.role === 'COACH' ? '🛡️ Coach' : '⚔️ Especialista'}
            </span>
          </div>
        )}
      </div>

      {/* ÁREA DE CRIAÇÃO (SÓ PARA COACH) */}
      {user && user.role === 'COACH' && (
        <div style={{marginBottom: '40px'}}>
          {!showCreateForm ? (
            <button 
              onClick={() => setShowCreateForm(true)}
              style={{width: '100%', padding: '15px', borderStyle: 'dashed', opacity: 0.7}}
            >
              + Nova Estratégia
            </button>
          ) : (
            <form onSubmit={handleCreateMatch} className="match-card" style={{padding: '20px', border: '1px solid var(--lol-gold)'}}>
              <h3 style={{marginTop: 0}}>Nova Análise Tática</h3>
              
              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px'}}>Título da Partida / Comp:</label>
                <input 
                  type="text" 
                  placeholder="Ex: Final CBLOL - Pain vs Loud" 
                  value={newMatch.title}
                  onChange={(e) => setNewMatch({...newMatch, title: e.target.value})}
                  required 
                />
              </div>

              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px'}}>Descrição da Estratégia:</label>
                <textarea 
                  placeholder="Ex: Vamos testar uma comp de Siege com Jayce e Varus..." 
                  value={newMatch.desc}
                  onChange={(e) => setNewMatch({...newMatch, desc: e.target.value})}
                  required 
                  style={{width: '100%', padding: '10px', backgroundColor: '#010a13', border: '1px solid #463714', color: '#f0e6d2'}}
                  rows="3"
                />
              </div>

              <div style={{display: 'flex', gap: '10px'}}>
                <button type="submit">Salvar Estratégia</button>
                <button 
                  type="button" 
                  onClick={() => setShowCreateForm(false)} 
                  style={{borderColor: '#ff4e50', color: '#ff4e50'}}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      
      {/* LISTA DE PARTIDAS */}
      <div className="match-list">
        {matches.length === 0 ? (
          <p style={{textAlign: 'center', opacity: 0.5}}>Nenhuma análise ativa no momento.</p>
        ) : (
          matches.map(match => (
            <div key={match.id} className="match-card" style={{padding: '20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                <h3 style={{margin: '0 0 10px 0', fontSize: '1.2em'}}>{match.title}</h3>
                <span className={`stats-badge ${match.status === 'VOTING' ? 'active' : ''}`} 
                      style={{
                        backgroundColor: match.status === 'VOTING' ? 'rgba(10, 200, 185, 0.2)' : '#333',
                        color: match.status === 'VOTING' ? 'var(--lol-cyan)' : '#888',
                        border: `1px solid ${match.status === 'VOTING' ? 'var(--lol-cyan)' : '#555'}`,
                        padding: '4px 8px',
                        fontSize: '0.7em',
                        borderRadius: '4px'
                      }}>
                  {match.status === 'VOTING' ? 'VOTAÇÃO ABERTA' : 'ENCERRADO'}
                </span>
              </div>
              
              <p style={{color: '#888', fontSize: '0.9em', marginBottom: '20px', lineHeight: '1.4'}}>
                {match.description}
              </p>
              
              {/* Botões de Ação */}
              {match.status === 'VOTING' ? (
                <Link to={`/vote/${match.id}`} style={{textDecoration: 'none'}}>
                  <button style={{width: '100%'}}>Analisar (Votar)</button>
                </Link>
              ) : (
                <Link to={`/result/${match.id}`} style={{textDecoration: 'none'}}>
                  <button style={{width: '100%', borderColor: '#555', color: '#aaa'}}>Ver Resultado</button>
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}