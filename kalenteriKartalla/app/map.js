// Map.js
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>OSM Leaflet Map</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link 
      rel="stylesheet" 
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    />
    <style>
      #map { height: 100vh; width: 100vw; margin: 0; padding: 0; }
      body { margin: 0; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      var map = L.map('map').setView([60.1699, 24.9384], 13); // Helsinki
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(map);

      map.on('click', function(e) {
        // Kysy käyttäjältä nimi/tiedot merkille
        var userText = prompt("Anna merkille nimi tai kuvaus:");

        // Jos käyttäjä ei kirjoita mitään, käytetään koordinaatteja
        if (!userText) {
          userText = 'Merkki: ' + e.latlng.lat.toFixed(5) + ', ' + e.latlng.lng.toFixed(5);
        }

        var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map)
          .bindPopup(userText + '<br><b>Klikkaa poistaaksesi</b>')
          .openPopup();

        // Poisto-ominaisuus klikkaamalla markkeria
        marker.on('click', function() {
          map.removeLayer(marker);
        });
      });
    </script>
  </body>
</html>
`;

export default function Map() {
  return (
    <SafeAreaView style={styles.container}>
      <WebView originWhitelist={['*']} source={{ html }} style={{ flex: 1 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
