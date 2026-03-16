#include <esp_now.h>
#include <WiFi.h> // if ESP8266 #include <ESP8266WiFi.h>
#include "DHT.h"
#include <esp_wifi.h>

#define DHTTYPE DHT11
#define DHTPIN 5

DHT dht(DHTPIN,DHTTYPE);

//Receiver Mac Address
uint8_t receiverAddress[] = {0x8C, 0x4F, 0x00, 0x10, 0xD9, 0x94};

typedef struct struct_message {
  int Zone = 1;
  float humidity;
  float temp;  
} struct_message;

struct_message myData; // Create an instance of the box

void setup() {

  dht.begin();
  Serial.begin(115200);
  WiFi.mode(WIFI_STA); // Must be in Station mode

  esp_wifi_set_promiscuous(true);
  esp_wifi_set_channel(11, WIFI_SECOND_CHAN_NONE);
  esp_wifi_set_promiscuous(false);

  esp_now_init(); // Start ESP-NOW
  
  // Register the receiver as a "peer"
  esp_now_peer_info_t peerInfo = {};
  memcpy(peerInfo.peer_addr, receiverAddress, 6);
  esp_now_add_peer(&peerInfo);
}

void loop() {
  // Send the data

  myData.humidity = dht.readHumidity();
  myData.temp = dht.readTemperature();

  // Iterate through all 13 Wi-Fi channels to find and send data to the receiver 
  for(int i = 1; i <=13 ; i++){
    esp_wifi_set_channel(i, WIFI_SECOND_CHAN_NONE);// Switch to current channel

    esp_err_t message = esp_now_send(receiverAddress, (uint8_t *) &myData, sizeof(myData));

 
    if(message == ESP_OK){
      delay(10);// Short pause if send was successful to allow processing
    }

  }

  //Serial.println(WiFi.channel());
  delay(2000);
  
}

//add more sensors - ok
// make channel can be change-ok