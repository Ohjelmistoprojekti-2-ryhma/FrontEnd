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

export default function AddEventScreen({ navigation, route }) {
  const { selectedDate, onSave, location, contacts = [] } = route.params || {};
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [contactName, setContactName] = useState("");
  const [showPicker, setShowPicker] = useState(false);


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
    <View style={addEventStyles.container}>
      <Text style={addEventStyles.label}>Date: {selectedDate}</Text>

      {/* Title */}
      <TextInput
        style={addEventStyles.input}
        placeholder="Enter event title"
        value={title}
        onChangeText={setTitle}
      />

      {/* Description */}
      <TextInput
        style={[addEventStyles.input, { height: 80 }]}
        placeholder="Enter event description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/*Select Contact Button*/}
      <TouchableOpacity
        style={addEventStyles.changeButton}
        onPress={() => setShowPicker(!showPicker)}
      >
        <Text style={addEventStyles.changeButtonText} >
          {contactName ? `Selected Contact: ${contactName}` : "Select Contact"}
        </Text>
      </TouchableOpacity>

      {/*Contacts */}
      {showPicker && (
        <View style={addEventStyles.pickerWrapper}>
          <Picker
            style={addEventStyles.picker}
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


      <Text style={addEventStyles.label}>Time: {formatTime(time)}</Text>
      <TouchableOpacity
        style={addEventStyles.timeButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={addEventStyles.timeButtonText}>Select Time</Text>
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
            ? `Location: ${selectedLocation.lat}, ${selectedLocation.lng}`
            : "Select location on map"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={addEventStyles.saveButton} onPress={() => handleSave()}>
        <Text style={addEventStyles.saveButtonText}>Save Event</Text>
      </TouchableOpacity>
    </View>
  );
}


