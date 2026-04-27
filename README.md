# LoL Strategy Analyzer

![Status](https://img.shields.io/badge/Status-Concluído-brightgreen)
![Stack](https://img.shields.io/badge/Stack-React_|_Node.js_|_MySQL-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**[Demo ao vivo](https://lol-strategy-mvp-production.up.railway.app)**

Ferramenta full stack para análise tática em partidas de League of Legends. Coaches criam salas de votação, players calibram os atributos do time via sliders, e o sistema calcula automaticamente a viabilidade da composição contra o arquétipo inimigo.

---

## Galeria

### Login
![Tela de Login](./screenshots/login.png)

### Dashboard
Visão geral das partidas abertas. O Coach acompanha as votações em andamento, players acessam as salas disponíveis.

![Dashboard Principal](./screenshots/dashboard2.png)

### Criação de Estratégia
Interface exclusiva para Coaches definirem título e descrição tática da análise.

![Nova Estratégia](./screenshots/new-strategy.png)

### Sala de Votação
O player define o arquétipo inimigo (Tank, Poke, Burst...) e ajusta os sliders de DPS, Burst, Engage e Peel do próprio time.

![Tela de Votação](./screenshots/voting.png)

### Resultado
O backend processa os inputs contra uma matriz de pesos por arquétipo e retorna o Tier da composição (S, A, B...) com o breakdown detalhado do cálculo.

![Resultado Tier A](./screenshots/result.png)

---

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Frontend | React, Vite, CSS Modules |
| Backend | Node.js, Express |
| Banco de Dados | MySQL |
| Segurança | Bcrypt, CORS, Dotenv |

---

## Rodando localmente

**Pré-requisitos:** Node.js e MySQL instalados.

```bash
# Clone o repositório
git clone https://github.com/raoni-aguiar/lol-strategy-mvp.git
cd lol-strategy-mvp

# Backend
cd server
npm install
# Crie um .env baseado no .env.example com suas credenciais
npm start

# Frontend (em outro terminal)
cd ..
npm install
npm run dev
```

---

Desenvolvido por **Raoni Aguiar** — [LinkedIn](https://linkedin.com/in/raoni-aguiar) · [GitHub](https://github.com/raoni-aguiar)
