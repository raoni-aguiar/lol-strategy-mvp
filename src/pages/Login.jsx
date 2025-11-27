import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css'; 

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false); // Toggle entre Login/Registro
  const [name, setName] = useState(''); // Só usado no registro
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('SPECIALIST');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    const body = isRegistering 
      ? { name, username, password, role }
      : { username, password, role };

    try {
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        if (isRegistering) {
          alert("Conta criada! Faça login agora.");
          setIsRegistering(false); // Volta para a tela de login
        } else {
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/dashboard');
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="login-container">
      <h1>LoL Strategy Analyzer</h1>
      <h3>{isRegistering ? "Criar Nova Conta" : "Login"}</h3>
      
      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <input 
            type="text" placeholder="Seu Nome Real" 
            value={name} onChange={(e) => setName(e.target.value)} required 
          />
        )}
        
        <input 
          type="text" placeholder="Usuário (Login)" 
          value={username} onChange={(e) => setUsername(e.target.value)} required 
        />
        <input 
          type="password" placeholder="Senha" 
          value={password} onChange={(e) => setPassword(e.target.value)} required 
        />
        
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="SPECIALIST">Especialista (Jogador)</option>
          <option value="COACH">Coach (Titular)</option>
        </select>
        
        <button type="submit" className="btn-start">
          {isRegistering ? "Registrar" : "Entrar no Rift"}
        </button>
      </form>

      <p style={{marginTop: '15px', cursor: 'pointer', color: 'var(--lol-gold)'}} 
         onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "Já tem conta? Voltar para Login" : "Não tem conta? Crie aqui"}
      </p>
    </div>
  );
}