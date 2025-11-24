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
import { Picker } from '@react-native-picker/picker';

import { useTheme } from "../components/ThemeContext";

export default function AddEventScreen({ navigation, route }) {
  const { selectedDate, onSave, location, contacts = [] } = route.params || {};
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [contactName, setContactName] = useState("");
  const [showPicker, setShowPicker] = useState(false);


  const { darkmode } = useTheme();
  const styles = addEventStyles(darkmode);

  useEffect(() => {
    if (location) {
      setSelectedLocation(location);
    }
  }, [location]);

  // Save the new event
  const handleSave = (coords = selectedLocation) => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter an event title.");
      return;
    }

    const formattedTime = time.toTimeString().slice(0, 5); // HH:MM

    // Add a new event object
    const newEvent = {
      id: Date.now(),
      date: selectedDate,
      title: title.trim(),
      description: description.trim(),
      time: formattedTime,
      location: selectedLocation,
      contactName: contactName,
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

  // Format time
  const formatTime = (dateObj) => {
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date: {selectedDate}</Text>

      {/* Title */}
      <TextInput
        style={styles.input}
        placeholder="Enter event title"
        value={title}
        onChangeText={setTitle}
      />

      {/* Description */}
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Enter event description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/*Select Contact Button*/}
      <TouchableOpacity
        style={styles.changeButton}
        onPress={() => setShowPicker(!showPicker)}
      >
        <Text style={styles.changeButtonText} >
          {contactName ? `Selected Contact: ${contactName}` : "Select Contact"}
        </Text>
      </TouchableOpacity>

      {/*Contacts */}
      {showPicker && (
        <View style={styles.pickerWrapper}>
          <Picker
            style={styles.picker}
            selectedValue={contactName}
            onValueChange={(value) => setContactName(value)}
          >
            <Picker.Item label="No contact" value="" />
            {contacts.map((contact) => (
              <Picker.Item key={contact.id}
                label={`${contact.firstName || ""} ${contact.lastName || ""} (${contact.phoneNumbers?.[0]?.number || "No number"})`}
                value={`${contact.firstName || ""} ${contact.lastName || ""}`}
              />
            ))}
          </Picker>
        </View>
      )}


      <Text style={styles.label}>Time: {formatTime(time)}</Text>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.timeButtonText}>Select Time</Text>
      </TouchableOpacity>


      {/* Time Picker */}
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

      {/* Location Selector */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() =>
          navigation.navigate("Map", {
            eventTitle: title || "Untitled Event",
            onSelectLocation: (coords) => setSelectedLocation(coords),
            events: route.params?.allEvents || [],
          })
        }

      >
        <Text style={styles.locationButtonText}>
          {selectedLocation
            ? `Location: ${selectedLocation.lat}, ${selectedLocation.lng}`
            : "Select location on map"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={() => handleSave()}>
        <Text style={styles.saveButtonText}>Save Event</Text>
      </TouchableOpacity>
    </View>
  );
}


