import React, { useRef, useCallback } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { useFocusEffect } from "@react-navigation/native";
import mapStyles from "../components/MapStyles";
import { getMapHTML } from "../components/getMapHTML";

export default function Map({ navigation, route }) {
  // Retrieve parameters passed from navigation
  const onSelectLocation = route.params?.onSelectLocation;
  const eventTitle = route.params?.eventTitle || "Event";
  const events = route.params?.events || [];

  // Reference to the WebView component (used for updating the map)
  // (currently, updating is not working properly)
  const webviewRef = useRef(null);

  // Loads the WebView content from an external HTML file
  const html = getMapHTML(events, eventTitle);

  // Handles messages received from the map (user-selected coordinates)
  const handleMessage = (event) => {
    try {
      const coords = JSON.parse(event.nativeEvent.data);
      if (onSelectLocation) onSelectLocation(coords);
      navigation.goBack();
    } catch (err) {
      console.warn("Invalid data from map:", err);
    }
  };

  // Updates map markers whenever the screen is focused again
  // (again, currently not working)
  useFocusEffect(
    useCallback(() => {
      if (webviewRef.current) {
        webviewRef.current.injectJavaScript(`
          if (window.updateEvents) {
            window.updateEvents(${JSON.stringify(route.params?.events || [])});
          }
          true;
        `);
      }
    }, [route.params?.events])
  );

  return (
    <View style={mapStyles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        source={{ html }}
        style={{ flex: 1 }}
        onMessage={handleMessage}
      />
    </View>
  );
}
