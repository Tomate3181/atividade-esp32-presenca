import { supabase } from './supabase-config.js';

// =================== AUTENTICAÇÃO ===================
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
    }
}
checkAuth();

document.getElementById('btn-logout').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
});

// =================== GSAP & ANIMAÇÕES (THEMING) ===================
const particlesContainer = document.getElementById('particles-container');
let currentTheme = 'confortavel'; 
let particleInterval = null;

function clearParticles() {
    particlesContainer.innerHTML = '';
    if (particleInterval) clearInterval(particleInterval);
}

function createParticle(theme) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particlesContainer.appendChild(particle);

    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    
    if (theme === 'frio') {
        // Cristais de Gelo / Neve estilo HK (brilho azulado)
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = '#e0f2fe';
        particle.style.boxShadow = '0 0 10px #bae6fd';
        gsap.fromTo(particle, 
            { x: startX, y: -20, opacity: Math.random() * 0.8 },
            { 
                y: window.innerHeight + 20, 
                x: startX + (Math.random() * 150 - 75), 
                duration: Math.random() * 5 + 5, 
                ease: "none",
                onComplete: () => particle.remove() 
            }
        );
    } else if (theme === 'quente') {
        // Infecção / Brasas (Laranja/Amarelo brilhante subindo)
        particle.style.width = Math.random() * 8 + 4 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = Math.random() > 0.3 ? '#f97316' : '#facc15';
        particle.style.boxShadow = '0 0 15px #ea580c';
        gsap.fromTo(particle, 
            { x: startX, y: window.innerHeight + 20, opacity: 0.8 },
            { 
                y: -20, 
                x: startX + (Math.random() * 100 - 50), 
                duration: Math.random() * 4 + 3, 
                ease: "power1.inOut",
                opacity: 0,
                onComplete: () => particle.remove() 
            }
        );
    } else {
        // Poeira do Vazio (Hollow Knight default - partículas cinzas/brancas flutuando)
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = Math.random() > 0.5 ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.4)';
        particle.style.boxShadow = '0 0 5px rgba(255,255,255,0.1)';
        gsap.fromTo(particle, 
            { x: startX, y: startY, opacity: 0, scale: 0.5 },
            { 
                x: startX + (Math.random() * 60 - 30), 
                y: startY - (Math.random() * 100 + 50), 
                duration: Math.random() * 6 + 6, 
                ease: "sine.inOut",
                opacity: 0.7,
                scale: 1,
                onComplete: () => {
                    gsap.to(particle, {
                        opacity: 0,
                        duration: 2,
                        onComplete: () => particle.remove()
                    });
                }
            }
        );
    }
}

function applyTheme(temp) {
    let newTheme = 'confortavel';
    let bgColor = '#1a1e23'; // Padrão: tom escuro caverna
    
    if (temp < 18) {
        newTheme = 'frio';
        bgColor = '#0b1421'; // Azul muito escuro e frio
    } else if (temp > 26) {
        newTheme = 'quente';
        bgColor = '#2a1207'; // Laranja muito escuro / infeccioso
    } else {
        newTheme = 'confortavel';
        bgColor = '#1a1e23'; // Padrão
    }

    if (newTheme !== currentTheme || !particleInterval) {
        currentTheme = newTheme;
        
        // Transição suave da cor de fundo (vignette já existe no CSS por cima)
        gsap.to("body", { backgroundColor: bgColor, duration: 1.5 });
        
        clearParticles();
        // Gera partículas de acordo com o tema com uma frequência ajustada
        particleInterval = setInterval(() => {
            createParticle(currentTheme);
        }, currentTheme === 'frio' ? 120 : currentTheme === 'quente' ? 150 : 300);
    }
}

// Inicia com tema padrão
applyTheme(22);

// =================== MQTT & ATUALIZAÇÃO DE DADOS ===================
const brokerUrl = 'wss://broker.emqx.io:8084/mqtt';
const topic = 'samuel/iot/temperatura-presenca';

// ID aleatório para o cliente web
const clientId = 'web_client_' + Math.random().toString(16).substr(2, 8);

console.log('Conectando ao broker MQTT...');
const client = mqtt.connect(brokerUrl, { 
    clientId: clientId,
    reconnectPeriod: 5000,
    keepalive: 60,
    clean: true
});

// Limitar listeners para evitar memory leak
if (client.setMaxListeners) {
    client.setMaxListeners(20);
}

client.on('connect', () => {
    console.log('✅ Conectado ao MQTT via WebSockets!');
    document.getElementById('mqtt-status').textContent = '● Conectado';
    document.getElementById('mqtt-status').style.color = '#51cf66';
    client.subscribe(topic, (err) => {
        if (!err) {
            console.log('✅ Inscrito no tópico: ' + topic);
        } else {
            console.error('❌ Erro ao inscrever no tópico:', err);
        }
    });
});

client.on('error', (err) => {
    console.error('❌ Erro MQTT:', err);
});

client.on('offline', () => {
    console.warn('⚠️ Conexão MQTT offline, tentando reconectar...');
    document.getElementById('mqtt-status').textContent = '● Reconectando...';
    document.getElementById('mqtt-status').style.color = '#ffa500';
    document.getElementById('status-temp').textContent = 'Desconectado do broker';
    document.getElementById('status-presenca').textContent = 'Desconectado do broker';
});

client.on('reconnect', () => {
    console.log('🔄 Reconectando ao MQTT...');
});

// Animação de pulsar ao receber dados, com um brilho espectral
function pulseCard(cardId, colorStr) {
    gsap.fromTo(`#${cardId}`, 
        { scale: 1.02, boxShadow: `0 0 30px ${colorStr}` },
        { scale: 1, boxShadow: '0 0 40px rgba(0,0,0,0.8)', duration: 0.8, ease: 'power2.out' }
    );
}

// Lida com as mensagens recebidas
client.on('message', async (t, message) => {
    console.log('📨 Mensagem recebida no tópico:', t);
    if (t === topic) {
        try {
            const payload = message.toString();
            console.log('✅ Payload recebido:', payload);
            const data = JSON.parse(payload);
            
            // Validação dos dados
            if (data.temperatura === undefined || data.presenca === undefined) {
                console.error('❌ Dados incompletos recebidos:', data);
                return;
            }
            
            const temp = parseFloat(data.temperatura);
            const presenca = parseInt(data.presenca); // 1 ocupado, 0 livre
            
            // Atualiza UI da Temperatura
            document.getElementById('temp-value').textContent = temp.toFixed(1) + ' °C';
            
            let statusTemp = '';
            let tempGlow = 'rgba(255,255,255,0.3)';
            if (temp < 18) {
                statusTemp = 'Frio - Ajustar climatização';
                tempGlow = 'rgba(186, 230, 253, 0.4)';
            } else if (temp > 26) {
                statusTemp = 'Quente - Ajustar climatização';
                tempGlow = 'rgba(249, 115, 22, 0.4)';
            } else {
                statusTemp = 'Confortável - Ideal';
                tempGlow = 'rgba(255,255,255,0.3)';
            }
            document.getElementById('status-temp').textContent = statusTemp;
            
            // Atualiza UI da Presença
            let presencaGlow = 'rgba(255,255,255,0.3)';
            if (presenca === 1) {
                document.getElementById('presenca-value').textContent = 'Ocupada';
                document.getElementById('presenca-value').style.color = '#fff';
                document.getElementById('presenca-value').style.textShadow = '0 0 25px rgba(249, 115, 22, 0.8)';
                document.getElementById('status-presenca').textContent = 'Movimento detectado';
                presencaGlow = 'rgba(249, 115, 22, 0.4)';
            } else {
                document.getElementById('presenca-value').textContent = 'Livre';
                document.getElementById('presenca-value').style.color = '#ccc';
                document.getElementById('presenca-value').style.textShadow = '0 0 10px rgba(255,255,255,0.2)';
                document.getElementById('status-presenca').textContent = 'Nenhum movimento';
            }

            // Aplica os efeitos visuais
            applyTheme(temp);
            pulseCard('card-temp', tempGlow);
            pulseCard('card-presenca', presencaGlow);

            // Insere no Supabase (opcional para manter o histórico de eventos da caverna)
            await supabase.from('leituras').insert([
                { temperatura: temp, presenca: presenca === 1 }
            ]);

        } catch (error) {
            console.error('Erro ao processar mensagem MQTT:', error);
        }
    }
});
