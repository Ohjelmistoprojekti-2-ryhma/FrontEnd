export const getMapHTML = (events, eventTitle) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    />
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <style>
      #map { height: 100vh; width: 100vw; margin: 0; padding: 0; }
      body { margin: 0; }
      #searchBox {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 1000;
        display: flex;
        gap: 6px;
      }
      #searchInput {
        width: 200px;
        padding: 6px;
      }
      #searchButton {
        padding: 6px 10px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <div id="searchBox">
      <input id="searchInput" type="text" placeholder="Enter street..." />
      <button id="searchButton">Find</button>
    </div>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>

        
        // Initialize Leaflet map centered in Helsinki
        const map = L.map('map').setView([60.1699, 24.9384], 12);
        map.zoomControl.setPosition("topright");

        // Add OpenStreetMap tiles as the base map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);

        // Store map markers representing events
        let eventMarkers = [];

        // Draw all events on the map
        function drawEvents(events) {
          // Remove old markers before drawing new ones
          eventMarkers.forEach(m => map.removeLayer(m));
          eventMarkers = [];

          // Create a marker for each event with a location
          events.forEach(ev => {
            if (ev.location && ev.location.latitude && ev.location.longitude) {
              const marker = L.marker([ev.location.latitude, ev.location.longitude])
                .addTo(map)
                .bindPopup(ev.title || "Untitled");
              eventMarkers.push(marker);
            }
          });
        }

        // Draw initial set of events when the map loads
        drawEvents(${JSON.stringify(events)});

        // Function callable from React Native to update event markers
        window.updateEvents = function(newEvents) {
          drawEvents(newEvents);
        };

        // Handle user clicks to select a new event location
        let tempMarker;
        map.on('click', function(e) {
          if (tempMarker) map.removeLayer(tempMarker);

          tempMarker = L.marker([e.latlng.lat, e.latlng.lng])
            .addTo(map)
            .bindPopup(${JSON.stringify(eventTitle)})
            .openPopup();

          // Send the selected coordinates back to React Native
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ lat: e.latlng.lat, lng: e.latlng.lng })
          );
        });

        // Photon search
        document.getElementById('searchButton').addEventListener('click', function () {
          var query = document.getElementById('searchInput').value;

          if (!query) return;

          fetch(\`https://photon.komoot.io/api/?q=\${encodeURIComponent(query)}\`)
            .then(r => r.json())
            .then(data => {
              if (data.features && data.features.length > 0) {
                var p = data.features[0].geometry.coordinates;
                var lat = p[1];
                var lon = p[0];

                map.setView([lat, lon], 16);

                L.marker([lat, lon]).addTo(map)
                  .bindPopup(query)
                  .openPopup();
              } else {
                alert("No results found.");
              }
            })
            .catch(err => {
              alert("Search failed");
              console.error(err);
            });
        });
      </script>
  </body>
</html>
`;
