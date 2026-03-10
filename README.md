# LoL Strategy Analyzer ⚔️

Ferramenta Full Stack para análise tática e tomada de decisão em partidas de League of Legends. O sistema permite que times (Coaches e Players) votem em estratégias e utiliza um algoritmo de análise de dados para calcular matchups favoráveis com base em estatísticas de dano e arquétipos de inimigos.

![Status do Projeto](https://img.shields.io/badge/Status-Concluído-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_Node.js_|_MySQL-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📸 Galeria do Projeto

### 1. Login Hextech
Autenticação segura com design temático imersivo.

![Tela de Login](./screenshots/login.png)

### 2. Dashboard de Estratégias
Visão geral das partidas. O Coach acompanha quais votações estão abertas e os players acessam as salas.

![Dashboard Principal](./screenshots/dashboard2.png)

### 3. Área do Coach (Criação)
Interface exclusiva para Coaches definirem o título e a descrição tática da nova análise.

![Nova Estratégia](./screenshots/new-strategy.png)

### 4. Sala de Votação (Análise)
O player define o arquétipo do inimigo (ex: Tank, Poke) e ajusta os sliders de atributos do time — DPS, Burst, Engage e Peel.

![Tela de Votação](./screenshots/voting.png)

### 5. Resultado da Análise (Algoritmo)
O backend processa os inputs contra uma matriz de pesos por arquétipo e retorna o Tier da composição com feedback visual instantâneo.

![Resultado Tier A](./screenshots/result.png)

---

## 🎯 Funcionalidades

- **Dashboard de Estratégia:** Visualização de partidas e status de votação em tempo real.
- **Sistema de Votação:** Sessões interativas onde players calibram os atributos do time via sliders.
- **Análise Algorítmica:** O backend processa os status contra arquétipos de inimigos e retorna a viabilidade da composição (Tier S, A, B...).
- **Autenticação Segura:** Login e registro com hash de senhas (bcrypt) e controle de acesso por papel (Coach vs Player).

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologias |
|--------|-------------|
| Frontend | React, Vite, CSS Modules |
| Backend | Node.js, Express |
| Banco de Dados | MySQL |
| Segurança | Bcrypt, CORS, Dotenv |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js instalado
- MySQL rodando

### Passo 1: Clonar o repositório
```bash
git clone https://github.com/raoni-aguiar/lol-strategy-mvp.git
cd lol-strategy-mvp
```

### Passo 2: Configurar o Backend
```bash
cd server
npm install
```
Crie um arquivo `.env` baseado no `.env.example` com as credenciais do seu banco de dados e rode:
```bash
npm start
```

### Passo 3: Configurar o Frontend
```bash
cd ..
npm install
npm run dev
```

---

## 👤 Autor

Desenvolvido por **Raoni Mendonça Aguiar Capodeferro**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-raoni--aguiar-blue?logo=linkedin)](https://linkedin.com/in/raoni-aguiar)
[![GitHub](https://img.shields.io/badge/GitHub-raoni--aguiar-black?logo=github)](https://github.com/raoni-aguiar)
