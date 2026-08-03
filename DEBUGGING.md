## 🔧 Guia de Depuração - Problema: Dados não atualizam

### ✅ Correções Aplicadas

1. **Reconexão Automática MQTT** - O cliente agora tenta reconectar a cada 5 segundos
2. **Status Visual** - Indicador de conexão MQTT na navbar (verde = conectado, vermelho = desconectado)
3. **Logs Detalhados** - Console mostra exatamente o que está acontecendo
4. **Tratamento de Erros** - Erros de conexão são capturados e exibidos

### 🔍 Como Diagnosticar

#### Passo 1: Abrir Console do Navegador
- Pressione `F12` ou `Ctrl+Shift+I`
- Vá na aba **Console**
- Você verá mensagens como:
  - `✅ Conectado ao MQTT via WebSockets!` - Tudo ok
  - `❌ Erro MQTT:` - Problema de conexão

#### Passo 2: Verificar Status na Página
- Observe o indicador `● Conectado` na navbar (canto superior direito)
- Se estiver vermelho = desconectado
- Se estiver verde = conectado e aguardando dados

#### Passo 3: Verificar ESP32
```
Certifique-se de que:
✓ ESP32 está conectado na mesma rede WiFi
✓ Sensor DHT22 está conectado ao pino 14
✓ Sensor PIR está conectado ao pino 15
✓ Serial mostra: "WiFi conectado!" e "conectado ao MQTT"
```

#### Passo 4: Verificar Tópico MQTT
- O projeto usa tópico: `samuel/iot/temperatura-presenca`
- O ESP32 publica EXATAMENTE neste tópico
- O formato esperado é:
```json
{
  "temperatura": 25.5,
  "presenca": 1
}
```

### 🚨 Problemas Comuns

| Problema | Solução |
|----------|---------|
| `● Desconectado` (vermelho) | Verifique firewall/antivírus bloqueando WebSocket |
| `Dados recebidos` mas UI não atualiza | Verifique console para erros de JSON |
| ESP32 não conecta ao broker | Verifique SSID/senha WiFi no código .ino |
| Mensagens no console mas não no tópico | Altere o tópico no dashboard.js para o usado no ESP32 |

### 📱 Testar Localmente (sem ESP32)

Abra o console e execute:
```javascript
// Simula uma mensagem MQTT
const testMessage = JSON.stringify({ temperatura: 22.5, presenca: 1 });
client.emit('message', 'samuel/iot/temperatura-presenca', Buffer.from(testMessage));
```

### 📊 Estrutura de Arquivos Corrigida
```
atividade/
├── index.html          ← Agora com status MQTT visual
├── login.html
├── cadastro.html
├── css/style.css
└── js/
    ├── dashboard.js    ← Melhorado com reconnect + logs
    └── supabase-config.js
```

### 🆘 Ainda não funciona?

1. Verifique no VS Code: Terminal > New Terminal
2. Execute: `npm install mqtt` (se não tiver)
3. Tente abrir `index.html` com Live Server
4. Cole o conteúdo dos LOGS do console aqui para análise

### 💡 Dica Extra

Para testar em tempo real se o broker MQTT está recebendo dados, você pode usar:
```bash
# Terminal do Windows (ou PowerShell)
npm install -g mqtt-cli
mqtt pub -h broker.emqx.io -t samuel/iot/temperatura-presenca -m '{"temperatura":25.5,"presenca":1}'
```

