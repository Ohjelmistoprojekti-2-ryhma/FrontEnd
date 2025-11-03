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
import addEventStyles from "../components/AddEventStyles";

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
    <View style={addEventStyles.container}>
      <Text style={addEventStyles.label}>Date: {selectedDate}</Text>

      <TextInput
        style={addEventStyles.input}
        placeholder="Enter event title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[addEventStyles.input, { height: 80 }]}
        placeholder="Enter event description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={addEventStyles.label}>Time: {formatTime(time)}</Text>
      <TouchableOpacity
        style={addEventStyles.timeButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={addEventStyles.timeButtonText}>Select Time</Text>
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
        style={addEventStyles.locationButton}
        onPress={() =>
          navigation.navigate("Map", {
            eventTitle: title || "Untitled Event",
            onSelectLocation: (coords) => setSelectedLocation(coords),
            events: route.params?.allEvents || [], 
          })
        }

      >
        <Text style={addEventStyles.locationButtonText}>
          {selectedLocation
            ? `Location: ${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
            : "Select location on map"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={addEventStyles.saveButton} onPress={() => handleSave()}>
        <Text style={addEventStyles.saveButtonText}>Save Event</Text>
      </TouchableOpacity>
    </View>
  );
}


