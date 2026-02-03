require('dotenv').config(); // Carrega variáveis de ambiente
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); 
const bcrypt = require('bcryptjs'); 
const { analyzeMatchup } = require('./logic');

const app = express();
const PORT = process.env.PORT || 3001; // Porta flexível

app.use(cors());
app.use(bodyParser.json());

// ==========================================
// AUTENTICAÇÃO
// ==========================================

app.post('/auth/register', async (req, res) => {
    const { username, password, role, name } = req.body;

    // Validação básica de entrada
    if (!username || !password || !role) {
        return res.status(400).json({ success: false, message: 'Dados incompletos.' });
    }

    try {
        const [existing] = await db.execute('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: 'Usuário já existe!' }); // 409 Conflict é mais semântico
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute(
            'INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, role, name]
        );

        res.status(201).json({ success: true, message: 'Usuário criado com sucesso!' });
    } catch (error) {
        console.error("Erro no registro:", error);
        res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
    }
});

app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body; 

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        }

        // Remove dados sensíveis antes de enviar
        delete user.password; 
        
        res.json({ success: true, user });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

// ==========================================
// API ENDPOINTS
// ==========================================

app.get('/api/matches', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM matches ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error("Erro ao buscar partidas:", error);
        res.status(500).json({ error: 'Erro ao buscar dados.' });
    }
});

app.post('/api/matches', async (req, res) => {
    const { title, description } = req.body;
    try {
        await db.execute(
            'INSERT INTO matches (title, description, status) VALUES (?, ?, "VOTING")',
            [title, description]
        );
        res.status(201).json({ success: true });
    } catch (error) {
        console.error("Erro ao criar partida:", error);
        res.status(500).json({ error: 'Erro ao criar partida.' });
    }
});

app.post('/api/analyze', (req, res) => {
    const { enemyType, stats } = req.body;

    if (!enemyType || !stats) {
        return res.status(400).json({ error: "Parâmetros inválidos para análise." });
    }

    try {
        // Isola a lógica de negócio (Data Science/Algorithm)
        const result = analyzeMatchup(enemyType, stats);
        res.json(result);
    } catch (error) {
        console.error("Erro na análise:", error);
        res.status(500).json({ error: "Falha ao processar análise." });
    }
});

// ==========================================
// SERVER START
// ==========================================

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});