// server/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); 
const bcrypt = require('bcryptjs'); // Biblioteca de criptografia

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

console.log("Iniciando servidor...");

// --- ROTA 1: REGISTRO DE USUÁRIO (Cria conta e encripta senha) ---
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

        res.json({ success: true, message: 'Usuário criado com sucesso!' });
    } catch (error) {
        console.error("Erro no registro:", error);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

// --- ROTA 2: LOGIN (Verifica senha encriptada) ---
app.post('/auth/login', async (req, res) => {
    const { username, password, role } = req.body; 

    try {
        // Busca usuário
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuário não encontrado.' });
        }

        const user = rows[0];

        // Se a senha no banco for "123" (texto puro, usuários antigos), compara direto
        // Se for um hash longo (novos usuários), usa o bcrypt
        let passwordMatch = false;
        
        if (user.password.length < 50) { 
            // Fallback para senhas antigas de teste (texto puro)
            passwordMatch = (password === user.password);
        } else {
            // Comparação segura com Hash
            passwordMatch = await bcrypt.compare(password, user.password);
        }

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Senha incorreta.' });
        }

        // Verifica cargo (Opcional, mas recomendado)
        if (role && user.role !== role) {
             return res.status(401).json({ success: false, message: `Este usuário não é um ${role}` });
        }

        delete user.password; // Não manda a senha de volta pro front
        res.json({ success: true, user });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// --- ROTA 3: LISTAR PARTIDAS (Dashboard) ---
app.get('/api/matches', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM matches ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error("Erro ao buscar partidas:", error);
        res.status(500).json({ error: 'Erro ao buscar partidas' });
    }
});

// --- ROTA 4: CRIAR NOVA PARTIDA (Para o Coach) ---
app.post('/api/matches', async (req, res) => {
    const { title, description } = req.body;
    try {
        await db.execute(
            'INSERT INTO matches (title, description, status) VALUES (?, ?, "VOTING")',
            [title, description]
        );
        res.json({ success: true });
    } catch (error) {
        console.error("Erro ao criar partida:", error);
        res.status(500).json({ error: 'Erro ao criar partida' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});