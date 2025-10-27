import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddEventScreen({ navigation, route }) {
  const { selectedDate, onSave, location } = route.params || {};
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

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

    const formattedTime = time.toTimeString().slice(0, 5); // HH:MM

    const newEvent = {
      id: Date.now(),
      date: selectedDate,
      title: title.trim(),
      description: description.trim(),
      time: formattedTime,
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

  const formatTime = (dateObj) => {
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
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

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Enter event description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Time: {formatTime(time)}</Text>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.timeButtonText}>Select Time</Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          is24Hour={true}
          onChange={(event, selectedTime) => {
            setShowTimePicker(Platform.OS === "ios");
            if (selectedTime) {
              setTime(selectedTime);
            }
          }}
        />
      )}

      <TouchableOpacity
        style={styles.locationButton}
        onPress={() =>
          navigation.navigate("Map", {
            eventTitle: title || "Untitled Event",
            onSelectLocation: (coords) => setSelectedLocation(coords),
          })
        }
      >
        <Text style={styles.locationButtonText}>
          {selectedLocation
            ? `Location: ${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
            : "Select location on map"}
        </Text>
      </TouchableOpacity>

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
  timeButton: {
    backgroundColor: "#fa858f",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 20,
  },
  timeButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
