import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON
app.use(express.json());

// Serve public directory statically
app.use(express.static(path.join(__dirname, 'public')));

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing in .env!');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API endpoint for connection test
app.post('/api/teste', async (req, res) => {
  const { nome, email, telefone } = req.body;

  if (!nome || !email || !telefone) {
    return res.status(400).json({
      success: false,
      error: 'Por favor, preencha todos os campos: nome, email e telefone.'
    });
  }

  try {
    // Attempt to insert into volunteers table
    const { data, error } = await supabase
      .from('volunteers')
      .insert([
        {
          full_name: nome,
          email: email,
          phone: telefone,
          message: 'Registo de teste de conexao ao banco de dados via endpoint /api/teste',
          status: 'Pendente'
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Conexao bem sucedida! Dados inseridos com sucesso na tabela volunteers no Supabase.',
      data: data
    });
  } catch (error) {
    console.error('Error inserting data into Supabase:', error);
    return res.status(500).json({
      success: false,
      error: `Erro ao conectar/gravar no Supabase: ${error.message}`
    });
  }
});

// Serve test_conn.html at the /test route
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test_conn.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Test page available at http://localhost:${PORT}/test_conn.html`);
});
