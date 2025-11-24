import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    SafeAreaView,
    Platform,
    ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import editEventStyles from "../components/EditEventStyles";
import { Picker } from '@react-native-picker/picker';
import { useTheme } from "../components/ThemeContext";

export default function EditEventScreen({ navigation, route }) {
    const { event, onSaveEdit, onDelete, contacts } = route.params;

    const [title, setTitle] = useState(event.title);
    const [description, setDescription] = useState(event.description || "");
    const [date, setDate] = useState(new Date(event.date));
    const [time, setTime] = useState(
        event.time ? new Date(`${event.date}T${event.time}`) : new Date()
    );

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [contactName, setContactName] = useState(event.contactName || "");
    const [showPicker, setShowPicker] = useState(false);

    const { darkmode } = useTheme();
    const styles = editEventStyles(darkmode);

    // Save the edited event
    const handleSave = () => {
        if (!title.trim()) {
            Alert.alert("Error", "Please enter an event title.");
            return;
        }

        // Format date and time
        const formattedDate = date.toISOString().split("T")[0];
        const formattedTime = time.toTimeString().slice(0, 5); // HH:MM

        onSaveEdit({
            ...event,
            title: title.trim(),
            description: description.trim(),
            date: formattedDate,
            time: formattedTime,
            contactName: contactName,
        });

        navigation.goBack();
    };

    //Delete the event
    const handleDelete = () => {
        Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    onDelete(event.id);
                    navigation.goBack();
                },
            },
        ]);
    };

    // Format date to dd.mm.yyyy
    const formatDate = (dateObj) => {
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Format time to hh:mm
    const formatTime = (dateObj) => {
        const hours = dateObj.getHours().toString().padStart(2, "0");
        const minutes = dateObj.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <Text style={styles.header}>Edit Event</Text>

                <View style={styles.form}>
                    {/* Title */}
                    <Text style={styles.label}>Event Title</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Event title"
                    />

                    {/* Description */}
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, { height: 80 }]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Event description"
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
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                            >
                                <Picker.Item label="No contact" value=""
                                />
                                {contacts.map((contact) => (
                                    <Picker.Item key={contact.id}
                                        label={`${contact.firstName || ""} ${contact.lastName || ""} (${contact.phoneNumbers?.[0]?.number || "No number"})`}
                                        value={`${contact.firstName || ""} ${contact.lastName || ""}`}
                                    />
                                ))}
                            </Picker>
                        </View>
                    )}

                    {/* Date */}
                    <Text style={styles.label}>Date</Text>
                    <Text style={styles.dateText}>{formatDate(date)}</Text>
                    <TouchableOpacity
                        style={styles.changeButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={styles.changeButtonText}>Change Date</Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(Platform.OS === "ios");
                                if (selectedDate) {
                                    setDate(selectedDate);
                                }
                            }}
                        />
                    )}

                    {/* Time */}
                    <Text style={styles.label}>Time</Text>
                    <Text style={styles.dateText}>{formatTime(time)}</Text>
                    <TouchableOpacity
                        style={styles.changeButton}
                        onPress={() => setShowTimePicker(true)}
                    >
                        <Text style={styles.changeButtonText}>Change Time</Text>
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

                    {/* Save/Delete Buttons */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                        <Text style={styles.deleteButtonText}>Delete Event</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView >
    );
}


