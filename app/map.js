import React, { useRef, useCallback, useState } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { useFocusEffect } from "@react-navigation/native";
import mapStyles from "../components/MapStyles";
import { getMapHTML } from "../components/getMapHTML";

export default function Map({ navigation, route }) {
  const onSelectLocation = route.params?.onSelectLocation;
  const eventTitle = route.params?.eventTitle || "Event";
  const events = route.params?.events || [];

  const webviewRef = useRef(null);
  const [webViewReady, setWebViewReady] = useState(false); // track if the map has loaded

  const html = getMapHTML(events, eventTitle);

  const handleMessage = (event) => {
    try {
      const coords = JSON.parse(event.nativeEvent.data);

      const normalized = {
        latitude: coords.lat,
        longitude: coords.lng,
      };

      if (onSelectLocation) onSelectLocation(normalized);

      navigation.goBack();
    } catch (err) {
      console.warn("Invalid data from map:", err);
    }
  };


  // When the WebView has loaded, set state and update the map
  const handleLoadEnd = () => {
    setWebViewReady(true);
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(`
        if (window.updateEvents) {
          window.updateEvents(${JSON.stringify(events)});
        }
        true;
      `);
      console.log("Kartta päivitetty ensimmäisen latauksen jälkeen");
    }
  };

  // When the view is reopened (focus returns to the map)
  useFocusEffect(
    useCallback(() => {
      if (webviewRef.current && webViewReady) {
        webviewRef.current.injectJavaScript(`
          if (window.updateEvents) {
            window.updateEvents(${JSON.stringify(events)});
          }
          true;
        `);
        console.log("Kartta päivitetty kun näkymä aktivoitui");
      }
    }, [events, webViewReady])
  );

  return (
    <View style={mapStyles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        source={{ html }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        onLoadEnd={handleLoadEnd}
        onMessage={handleMessage}
      />
    </View>
  );
}
