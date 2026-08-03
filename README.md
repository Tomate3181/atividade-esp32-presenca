# 🏠 Sistema IoT - Monitoramento de Sala Inteligente

## 📌 Sobre o Projeto

Sistema de monitoramento em tempo real de temperatura e presença em uma sala usando:
- **Frontend**: HTML5, CSS3, JavaScript (Supabase Auth, MQTT via WebSockets)
- **Backend**: Supabase (Autenticação e Banco de Dados)
- **Microcontrolador**: ESP32 com sensores DHT22 e PIR
- **Comunicação**: MQTT (Broker EMQX)

## 🛠️ Estrutura do Projeto

```
presenca-mqtt/
├── atividade/                 # Frontend Web
│   ├── index.html            # Dashboard principal
│   ├── login.html            # Página de login
│   ├── cadastro.html         # Página de registro
│   ├── css/
│   │   └── style.css         # Estilos (tema Hollow Knight)
│   └── js/
│       ├── dashboard.js      # Lógica MQTT e atualização
│       └── supabase-config.js# Configuração Supabase
├── esp32_codigo/
│   └── esp32_codigo.ino      # Código C++ para ESP32
├── supabase_migration.sql    # Schema do banco de dados
└── .env.example              # Template de variáveis de ambiente
```

## 📋 Funcionalidades

✅ **Autenticação Segura** - Login/Cadastro via Supabase  
✅ **Dashboard em Tempo Real** - Recepção de dados via MQTT  
✅ **Detecção de Presença** - Sensor PIR integrado  
✅ **Monitoramento de Temperatura** - Sensor DHT22  
✅ **Armazenamento de Histórico** - Banco Supabase  
✅ **Interface Responsiva** - Design tema Hollow Knight  

## 🚀 Como Usar

### 1. Configurar Supabase
- Copie `.env.example` para `.env`
- Adicione suas credenciais do Supabase
- Execute a migration SQL no Supabase

### 2. Configurar ESP32
- Instale bibliotecas: WiFi, PubSubClient, DHT
- Atualize SSID e senha WiFi no código
- Upload do código via Arduino IDE

### 3. Iniciar o Frontend
- Abra `atividade/index.html` em um navegador
- Faça login/cadastro
- Verifique se dados chegam do ESP32

## ⚠️ Considerações Importantes

1. **Segurança**: Em produção, use variáveis de ambiente em vez de colocar chaves no código
2. **MQTT**: O broker EMQX público é apenas para testes, configure um broker privado
3. **RLS**: As políticas Supabase já estão configuradas para usuários autenticados

## 📊 Fluxo de Dados

```
ESP32 (DHT22 + PIR) 
    ↓ WiFi
MQTT Broker (EMQX)
    ↓ WebSockets
Frontend (JavaScript)
    ↓
Supabase (Histórico)
```

## 📝 Autor
Aluno: Samuel
