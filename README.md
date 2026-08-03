# SmartRoom IoT - Sistema de Monitoramento de Sala Inteligente

Um sistema web completo para monitoramento de uma sala inteligente (escritório, sala de aula ou home office). Este projeto integra sensores reais (via ESP32), comunicação MQTT, um banco de dados em nuvem (Supabase) e um dashboard dinâmico e temático, inspirado na estética do jogo **Hollow Knight**.

## 🦇 Sobre o Projeto

O objetivo deste projeto é simular o acompanhamento do conforto ambiental (temperatura) e da ocupação de uma sala (presença de pessoas), com controle de acesso de usuários e visualização em tempo real das informações. 

O visual do sistema reage de forma dinâmica aos dados recebidos dos sensores:
- **Frio (< 18°C):** Tons escuros azulados com partículas cristalinas que lembram neve.
- **Confortável (18°C a 26°C):** Tons sombrios e elegantes com partículas flutuantes sutis (Void dust).
- **Quente (> 26°C):** Tons escuros alaranjados com partículas que simulam brasas de fogo.

## ✨ Funcionalidades

- **Autenticação de Usuários:** Sistema de Login e Cadastro utilizando Supabase Auth.
- **Dashboard em Tempo Real:** Conexão MQTT via WebSockets para receber os dados instantaneamente sem precisar recarregar a página.
- **Monitoramento de Temperatura:** Exibição da temperatura atual lida por um sensor DHT22.
- **Monitoramento de Ocupação:** Status da sala (Ocupada/Livre) baseada em um sensor de presença PIR.
- **Tematização Dinâmica:** Interface responsiva que altera cores, brilhos e animações de partículas com base na temperatura lida.

## 🛠️ Tecnologias Utilizadas

**Frontend:**
- HTML5 & CSS3
- JavaScript (Vanilla/ES6 Modules)
- [GSAP (GreenSock)](https://gsap.com/) para animações e efeitos de partículas.
- [MQTT.js](https://github.com/mqttjs/MQTT.js) para comunicação via WebSockets.
- Fonte: *Cinzel* (Google Fonts)

**Backend & Cloud:**
- [Supabase](https://supabase.com/) (Banco de Dados PostgreSQL & Autenticação)
- Broker MQTT Público: `broker.emqx.io`

**Hardware (Microcontrolador):**
- ESP32
- Sensor de Temperatura e Umidade DHT22
- Sensor de Presença PIR (Movimento)
- Código em C++ utilizando as bibliotecas `WiFi.h`, `PubSubClient` e `DHT.h`

## 📁 Estrutura do Projeto

```text
/
├── atividade/
│   ├── css/
│   │   └── style.css           # Estilos globais e tematização Hollow Knight
│   ├── js/
│   │   ├── dashboard.js        # Lógica principal, GSAP, e cliente MQTT
│   │   └── supabase-config.js  # Configuração de conexão do Supabase
│   ├── cadastro.html           # Página de criação de conta
│   ├── index.html              # Dashboard principal (Home)
│   └── login.html              # Página de acesso
├── esp32_codigo.ino            # Código-fonte para o ESP32
├── server.ts                   # Servidor Express simples para servir a pasta 'atividade'
├── supabase_migration.sql      # Script SQL para criar a tabela no Supabase
└── package.json
```

## 🚀 Como Executar

Siga as etapas abaixo para configurar e rodar o projeto localmente.

### 1. Configuração do Supabase
1. Crie uma conta e um projeto no [Supabase](https://supabase.com/).
2. No painel do Supabase, vá em **SQL Editor** e cole o conteúdo do arquivo `supabase_migration.sql` para criar a tabela de leituras e configurar as políticas de segurança (RLS).
3. Vá em **Authentication > Providers** e certifique-se de que o provedor *Email* está ativado.
4. (Opcional) Copie sua `Project URL` e `anon public key` e substitua no arquivo `/atividade/js/supabase-config.js` caso queira usar o seu próprio banco de dados em vez do fornecido.

### 2. Configuração do Hardware (ESP32)
1. Abra a IDE do Arduino ou utilize o [Wokwi](https://wokwi.com/) para simular.
2. Copie o código contido em `esp32_codigo.ino`.
3. Ajuste as credenciais de WiFi (`ssid` e `password`) conforme sua rede local (ou deixe `Wokwi-GUEST` se estiver usando o simulador Wokwi).
4. O esquema de montagem esperado é:
   - Pino `14`: Fio de dados do Sensor DHT22.
   - Pino `15`: Fio de dados do Sensor PIR.
5. Faça o upload do código para o ESP32 e verifique o Serial Monitor (115200 baud).

### 3. Executando o Frontend (Web)
Para rodar a interface web, você precisa de um servidor local simples, pois estamos utilizando JavaScript Modules (`type="module"`).

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. Instale as dependências executando na raiz do projeto:
   ```bash
   npm install
   ```
3. Inicie o servidor usando o live server.

4. O servidor iniciará. Acesse no seu navegador o endereço padrão que o servidor expõe (geralmente ele redirecionará direto para `http://localhost:3000/atividade/login.html`).

### 4. Utilizando o Sistema
1. Acesse a página de Cadastro e crie um novo usuário.
2. Faça o login com o usuário criado.
3. Observe a Dashboard aguardando os dados do ESP32.
4. Quando o ESP32 publicar dados no broker MQTT, a interface web se atualizará automaticamente e aplicará os efeitos visuais.

## ✒️ Autor
Desenvolvido por Samuel como Atividade de Fixação e Aprofundamento (SESI/SENAI - São Paulo).
