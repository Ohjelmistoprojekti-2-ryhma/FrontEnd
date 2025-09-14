// app/AddEventScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function AddEventScreen({ navigation, route }) {
  const { selectedDate, onSave } = route.params || {};
  const [title, setTitle] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter an event title.");
      return;
    }

    const newEvent = {
      id: Date.now(), 
      date: selectedDate,
      title: title.trim(),
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
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
