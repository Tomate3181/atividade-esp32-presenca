#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// =================== CONFIGURAÇÕES ===================
const char* ssid = "Wokwi-GUEST";
const char* password = "";

const char* mqtt_server = "broker.emqx.io";
const int mqtt_port = 1883;

#define DHT_PIN 14
#define DHT_TYPE DHT22

// Pino do Sensor de Presença PIR
#define PIR_PIN 15

DHT dht(DHT_PIN, DHT_TYPE);
WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando ao WiFi");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado!");
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando ao MQTT...");
    // ID do cliente aleatório para evitar conflitos
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {
      Serial.println("conectado!");
    } else {
      Serial.print("falhou, rc=");
      Serial.print(client.state());
      Serial.println(" tentando novamente em 5 segundos");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(PIR_PIN, INPUT); // Configura o PIR como entrada
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  float temperatura = dht.readTemperature();
  int presenca = digitalRead(PIR_PIN); // Lê o sensor PIR (HIGH/1 = Movimento, LOW/0 = Sem movimento)

  // Verifica se a leitura de temperatura falhou
  if (!isnan(temperatura)) {
    // Monta um JSON para enviar os dois dados no mesmo tópico
    String payload = "{";
    payload += "\"temperatura\": " + String(temperatura) + ", ";
    payload += "\"presenca\": " + String(presenca);
    payload += "}";

    // Publica no tópico configurado
    client.publish("samuel/iot/temperatura-presenca", payload.c_str());
    Serial.print("Dados publicados: ");
    Serial.println(payload);
  } else {
    Serial.println("Falha ao ler o sensor DHT!");
  }

  delay(3000);
}
