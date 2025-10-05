import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function Map({ navigation, route }) {
  const onSelectLocation = route.params?.onSelectLocation;
  const eventTitle = route.params?.eventTitle || "Event";

  const safeTitle = JSON.stringify(eventTitle); // suojaa erikoismerkeiltä

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
        var map = L.map('map').setView([60.1699, 24.9384], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);

        var marker;

        map.on('click', function(e) {
          if (marker) {
            map.removeLayer(marker);
          }

          marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map)
            .bindPopup(${safeTitle})
            .openPopup();

          window.ReactNativeWebView.postMessage(
            JSON.stringify({ lat: e.latlng.lat, lng: e.latlng.lng })
          );
        });
      </script>
    </body>
  </html>
  `;

  const handleMessage = (event) => {
    try {
      const coords = JSON.parse(event.nativeEvent.data);
      if (onSelectLocation) {
        onSelectLocation(coords);
      }
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (err) {
      console.warn("Invalid data from map:", err);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        style={{ flex: 1 }}
        onMessage={handleMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
