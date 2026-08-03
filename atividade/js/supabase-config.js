import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_CONFIG } from './config-local.js';

// Usar configurações do arquivo local (não commitado)
const supabaseUrl = SUPABASE_CONFIG.url;
const supabaseKey = SUPABASE_CONFIG.key;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: config-local.js não encontrado ou vazio!');
  console.error('Copie config-local.example.js para config-local.js e adicione suas credenciais');
} else {
  console.log('Supabase configurado com sucesso');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
