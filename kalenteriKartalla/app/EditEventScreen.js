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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import editEventStyles from "../components/EditEventStyles";

export default function EditEventScreen({ navigation, route }) {
    const { event, onSaveEdit, onDelete } = route.params;

    const [title, setTitle] = useState(event.title);
    const [description, setDescription] = useState(event.description || "");
    const [date, setDate] = useState(new Date(event.date));
    const [time, setTime] = useState(
        event.time ? new Date(`${event.date}T${event.time}`) : new Date()
    );

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);


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
        <SafeAreaView style={editEventStyles.container}>
            <Text style={editEventStyles.header}>Edit Event</Text>

            <View style={editEventStyles.form}>
                {/* Title */}
                <Text style={editEventStyles.label}>Event Title</Text>
                <TextInput
                    style={editEventStyles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Event title"
                />

                {/* Description */}
                <Text style={editEventStyles.label}>Description</Text>
                <TextInput
                    style={[editEventStyles.input, { height: 80 }]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Event description"
                    multiline
                />

                {/* Date */}
                <Text style={editEventStyles.label}>Date</Text>
                <Text style={editEventStyles.dateText}>{formatDate(date)}</Text>
                <TouchableOpacity
                    style={editEventStyles.changeButton}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={editEventStyles.changeButtonText}>Change Date</Text>
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
                <Text style={editEventStyles.label}>Time</Text>
                <Text style={editEventStyles.dateText}>{formatTime(time)}</Text>
                <TouchableOpacity
                    style={editEventStyles.changeButton}
                    onPress={() => setShowTimePicker(true)}
                >
                    <Text style={editEventStyles.changeButtonText}>Change Time</Text>
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
                <TouchableOpacity style={editEventStyles.saveButton} onPress={handleSave}>
                    <Text style={editEventStyles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={editEventStyles.deleteButton} onPress={handleDelete}>
                    <Text style={editEventStyles.deleteButtonText}>Delete Event</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}


