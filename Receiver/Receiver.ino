#include <esp_now.h>
#include <WiFi.h>
#include <Preferences.h>
#include <WebServer.h>
#include <esp_wifi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

WiFiClient espclient;
PubSubClient client(espclient);
Preferences pref;
WebServer server(80);

char subtopic[100];
char pubTopic[100];

char pubTempZone1[100];
char pubTempZone2[100];
char pubTempZone3[100];
char pubTempZone4[100];

char pubHumidZone1[100];
char pubHumidZone2[100];
char pubHumidZone3[100];
char pubHumidZone4[100];

char userID[50] = "User_1";

String SSID;
String Password;
String userid;


// Realys out pins 
int Relay_1 = 15;
int Relay_2 = 13;
int Relay_3 = 17;
int Relay_4 = 18;

// Reset btn
int ResetBtn = 4;

// Zone variable ( temp and humidity )
float Zone_1_Temp;
float Zone_2_Temp;
float Zone_3_Temp;
float Zone_4_Temp;

float Zone_1_humid;
float Zone_2_humid;
float Zone_3_humid;
float Zone_4_humid;



const char* mqtt_broker = "broker.emqx.io";
const int port = 1883;


// 1. The "box" MUST be identical to the sender's box
typedef struct struct_message {
  int Zone;
  float humidity;
  float temp;
} struct_message;

struct_message incomingData;

// 2. This runs when the box arrives
void OnDataRecv(const uint8_t * mac, const uint8_t *data, int len) {
  memcpy(&incomingData, data, sizeof(incomingData)); // Copy data into box

  float humidity = incomingData.humidity;
  float temp = incomingData.temp;

  int Zone = incomingData.Zone; // get Zone id

  if(Zone == 1){ // set Zone temp and humidity to Zone variable
    Zone_1_Temp = temp;
    Zone_1_humid = humidity;

    client.publish(pubTempZone1,String(Zone_1_Temp).c_str());
    client.publish(pubHumidZone1,String(Zone_1_humid).c_str());
  }
  else if(Zone == 2){
    Zone_2_Temp = temp;
    Zone_2_humid = humidity;

    client.publish(pubTempZone2,String(Zone_2_Temp).c_str());
    client.publish(pubHumidZone2,String(Zone_2_humid).c_str());
  }
  else if(Zone == 3){
    Zone_3_Temp = temp;
    Zone_3_humid = humidity;

    client.publish(pubTempZone3,String(Zone_3_Temp).c_str());
    client.publish(pubHumidZone3,String(Zone_3_humid).c_str());
  }
  else if(Zone == 4){
    Zone_4_Temp = temp;
    Zone_4_humid = humidity;

    client.publish(pubTempZone4,String(Zone_4_Temp).c_str());
    client.publish(pubHumidZone4,String(Zone_4_humid).c_str());
  }
  

}

void setup() {

  pinMode(ResetBtn,INPUT_PULLUP); // reset btn

  //relays 
  pinMode(Relay_1,OUTPUT);
  pinMode(Relay_2,OUTPUT);
  pinMode(Relay_3,OUTPUT);
  pinMode(Relay_4,OUTPUT);


  Serial.begin(115200);
  pref.begin("Cred",false);
  SSID = pref.getString("SSID","");
  Password = pref.getString("Pass","");
  userid = pref.getString("ID","");
  pref.end();

  if(userid.length() > 0){
    userid.toCharArray(userID, sizeof(userID));
  }

  if(SSID.length() > 0){
    Serial.println("WiFi is connectig" + SSID);
    WiFi.begin(SSID.c_str(),Password.c_str());

    while(WiFi.status()  != WL_CONNECTED){
      Serial.print(".");
      delay(1000);
    }

    if(WiFi.status() == WL_CONNECTED){
     Serial.println("Wifi connected");
     Serial.println(WiFi.channel());

     Serial.print("Mac Address : ");
     Serial.println(WiFi.macAddress());

     esp_wifi_set_ps(WIFI_PS_NONE); //disable Wi-Fi Power Saving mode. becasue this can delay the esp now 
     WiFi.mode(WIFI_STA);
    }
    else{
      StartAP();
    }


  }
  else{
    StartAP();
  }

  Topics(); // update topics

  client.setServer(mqtt_broker,port);
  client.setCallback(callback); // callback when message arrives

  esp_now_init();
  esp_now_register_recv_cb(esp_now_recv_cb_t(OnDataRecv));//run when esp now message arrives
}

void StartAP(){
  WiFi.softAP("ESP32");

  server.on("/wifi",HTTP_POST,[](){
    String NewSSID = server.arg("SSID");
    String NewPass = server.arg("Password");
    String userID = server.arg("ID");

    if(NewSSID.length() > 0){
      pref.begin("Cred",false);
      pref.putString("SSID",NewSSID);
      pref.putString("Pass",NewPass);
      pref.putString("ID",userID);
      pref.end();

      Serial.print("Wifi creds are saved");
      Serial.print(userID);

      server.send(200,"text/plain","Creds are saved");
      delay(5000);
      ESP.restart();
    }
    else{
      server.send(400,"text/plain","SSID missing");
    }

  });

  server.begin();
}

void loop() {

  server.handleClient();

  if(WiFi.status() == WL_CONNECTED){
    if(!client.connected()){
      reconnect(); // if not connectecd callback reconnected
    }
    client.loop();
  }


  if(digitalRead(ResetBtn) == LOW){
    Serial.print("Reseting");
    pref.begin("Cred",false);
    pref.clear();
    pref.end();
    delay(2000);
    ESP.restart();
  }

  Relays();

}

void callback(char* topic, byte* payload, unsigned int length){

  String message = "";
  for(int i = 0; i < length; i++){
    message += (char)payload[i]; //store payload in message
  }

  JsonDocument doc;
  deserializeJson(doc, message);


  String Sensor = doc["sensor"];
  String Zone = doc["zone"];
  int temp = doc["temp"];
  String Relay = doc["relay"];

  Serial.println(Sensor);
  Serial.println(Zone);
  Serial.println(temp);
  Serial.println(Relay);

  pref.begin("States");

  if(Sensor == "temp"){

    if(Zone == "1"){
      pref.putInt("Z_1_temp",temp);
      pref.putString("Z_1_relay",Relay);
    }
    else if(Zone == "2"){
      pref.putInt("Z_2_temp",temp);
      pref.putString("Z_2_relay",Relay);
    }
    else if(Zone == "3"){
      pref.putInt("Z_3_temp",temp);
      pref.putString("Z_3_relay",Relay);
    }
    else if(Zone == "4"){
      pref.putInt("Z_4_temp",temp);
      pref.putString("Z_4_relay",Relay);
    }

  }
  pref.end();
  //Serial.print(message);

}

void reconnect(){
  while(!client.connected()){
    Serial.print("Mqtt connecting ");


    String clientID = "ESPclinet-";
    clientID += String(random(0xffff),HEX); //  create random id

    if(client.connect(clientID.c_str())){
      Serial.print("connected");
      client.publish(pubTopic,"online");
      client.subscribe(subtopic);
    }
    else{
      Serial.println("Can't connect");
      Serial.println("Try again with 5 sec");
      delay(5000);
    }
  }
}



void Topics(){
  snprintf(subtopic, 100, "iot/%s/to_device", userID);
  snprintf(pubTopic, 100, "iot/%s/from_device", userID);
  
  snprintf(pubTempZone1, 100, "iot/%s/Zone1_temp", userID);
  snprintf(pubTempZone2, 100, "iot/%s/Zone2_temp", userID);
  snprintf(pubTempZone3, 100, "iot/%s/Zone3_temp", userID);
  snprintf(pubTempZone4, 100, "iot/%s/Zone4_temp", userID);

  snprintf(pubHumidZone1, 100, "iot/%s/Zone1_humid", userID);
  snprintf(pubHumidZone2, 100, "iot/%s/Zone2_humid", userID);
  snprintf(pubHumidZone3, 100, "iot/%s/Zone3_humid", userID);
  snprintf(pubHumidZone4, 100, "iot/%s/Zone4_humid", userID);
}

void Relays(){
  
  pref.begin("States",true);
  int Z_1_temp = pref.getInt("Z_1_temp",0);
  int Z_2_temp = pref.getInt("Z_2_temp",0);
  int Z_3_temp = pref.getInt("Z_3_temp",0);
  int Z_4_temp = pref.getInt("Z_4_temp",0); 

  String Z_1_relay = pref.getString("Z_1_relay","");
  String Z_2_relay = pref.getString("Z_2_relay","");
  String Z_3_relay = pref.getString("Z_3_relay","");
  String Z_4_relay = pref.getString("Z_4_relay","");

  pref.end();

  // Temp Relay controls 

  if(Z_1_relay.length() > 0){

    if(Zone_1_Temp >= Z_1_temp){
      digitalWrite(Z_1_relay.toInt(),HIGH);
    }
    else{
      digitalWrite(Z_1_relay.toInt(),LOW);
    }

  }

  if(Z_2_relay.length() > 0){

    if(Zone_2_Temp >= Z_2_temp){
      digitalWrite(Z_2_relay.toInt(),HIGH);
    }
    else{
      digitalWrite(Z_2_relay.toInt(),LOW);
    }

  }

  if(Z_3_relay.length() > 0){

    if(Zone_3_Temp >= Z_3_temp){
      digitalWrite(Z_3_relay.toInt(),HIGH);
    }
    else{
      digitalWrite(Z_3_relay.toInt(),LOW);
    }

  }

  if(Z_4_relay.length() > 0){

    if(Zone_4_Temp >= Z_4_temp){
      digitalWrite(Z_4_relay.toInt(),HIGH);
    }
    else{
      digitalWrite(Z_4_relay.toInt(),LOW);
    }

  }


}

//Connect with mqtt and send data -ok
// create dynamic topics  -ok
// get json data -ok
//Control Zone relays with zone temp  -ok
