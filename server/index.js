const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); 
const bcrypt = require('bcryptjs'); 
const { analyzeMatchup } = require('./logic'); // Importa a nova lógica de Matchup

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

console.log("------------------------------------------------");
console.log("🚀 Iniciando Servidor LoL Strategy Analyzer...");

// ==========================================
// AUTENTICAÇÃO (LOGIN & REGISTRO)
// ==========================================

// Rota de Registro
app.post('/auth/register', async (req, res) => {
    const { username, password, role, name } = req.body;

    try {
        // Verifica se usuário já existe
        const [existing] = await db.execute('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Usuário já existe!' });
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Salva no banco
        await db.execute(
            'INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, role, name]
        );

        console.log(`Novo usuário registrado: ${username}`);
        res.json({ success: true, message: 'Usuário criado com sucesso!' });
    } catch (error) {
        console.error("Erro no registro:", error);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

// Rota de Login
app.post('/auth/login', async (req, res) => {
    const { username, password, role } = req.body; 

    try {
        // Busca usuário
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuário não encontrado.' });
        }

        const user = rows[0];

        // Verificação de senha (suporta texto puro para legados e hash para novos)
        let passwordMatch = false;
        if (user.password.length < 50) { 
            passwordMatch = (password === user.password); // Legado (123)
        } else {
            passwordMatch = await bcrypt.compare(password, user.password); // Seguro (Hash)
        }

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Senha incorreta.' });
        }

        // Verifica cargo (Opcional)
        if (role && user.role !== role) {
             return res.status(401).json({ success: false, message: `Este usuário não é um ${role}` });
        }

        delete user.password; // Segurança: remove a senha do retorno
        console.log(`Login efetuado: ${username} (${role})`);
        res.json({ success: true, user });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// ==========================================
// GESTÃO DE PARTIDAS (DASHBOARD)
// ==========================================

// Listar Partidas
app.get('/api/matches', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM matches ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error("Erro ao buscar partidas:", error);
        res.status(500).json({ error: 'Erro ao buscar partidas' });
    }
});

// Criar Nova Partida (Apenas Coach)
app.post('/api/matches', async (req, res) => {
    const { title, description } = req.body;
    try {
        await db.execute(
            'INSERT INTO matches (title, description, status) VALUES (?, ?, "VOTING")',
            [title, description]
        );
        console.log(`Nova partida criada: ${title}`);
        res.json({ success: true });
    } catch (error) {
        console.error("Erro ao criar partida:", error);
        res.status(500).json({ error: 'Erro ao criar partida' });
    }
});

// ==========================================
// LÓGICA DE ANÁLISE (MATCHUP PONDERADO)
// ==========================================

app.post('/api/analyze', (req, res) => {
    // Espera receber: { enemyType: "TANK", stats: { DPS: 8, BURST: 5... } }
    const { enemyType, stats } = req.body;

    if (!enemyType || !stats) {
        return res.status(400).json({ error: "Dados incompletos (Falta Inimigo ou Stats)." });
    }

    console.log(`Processando análise contra arquétipo: ${enemyType}`);

    // Chama a função da nova lógica (arquivo logic.js)
    const result = analyzeMatchup(enemyType, stats);

    console.log("Tier Calculado:", result.tier);
    res.json(result);
});

// ==========================================
// INICIALIZAÇÃO
// ==========================================

app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log("------------------------------------------------");
});