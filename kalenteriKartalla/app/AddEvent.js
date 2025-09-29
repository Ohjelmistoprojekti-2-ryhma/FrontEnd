// AddEventScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function AddEventScreen({ navigation, route }) {
  const { selectedDate, onSave, location } = route.params || {};
  const [title, setTitle] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (location) {
      setSelectedLocation(location);
    }
  }, [location]);

  const handleSave = (coords = selectedLocation) => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter an event title.");
      return;
    }

    const newEvent = {
      id: Date.now(),
      date: selectedDate,
      title: title.trim(),
      location: coords,
    };

    if (typeof onSave === "function") {
      try {
        onSave(newEvent);
      } catch (err) {
        console.warn("onSave callback threw:", err);
      }
      navigation.goBack();
      return;
    }

    navigation.navigate("CalendarMain", { newEvent });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date: {selectedDate}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter event title"
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity
        style={styles.locationButton}
        onPress={() =>
          navigation.navigate("Map", {
            eventTitle: title || "Untitled Event",
            onSelectLocation: (coords) => handleSave(coords), // ⬅ sijainnin valinta tallentaa heti
          })
        }
      >
        <Text style={styles.locationButtonText}>
          {selectedLocation
            ? `Location: ${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
            : "Select location on map"}
        </Text>
      </TouchableOpacity>

      {/* Tämä jää vaihtoehtoiseksi nappulaksi jos halutaan manuaalisesti tallentaa ilman karttaa */}
      <TouchableOpacity style={styles.saveButton} onPress={() => handleSave()}>
        <Text style={styles.saveButtonText}>Save Event</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  locationButton: {
    backgroundColor: "#ddd",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 20,
  },
  locationButtonText: {
    color: "#333",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#fa858f",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
