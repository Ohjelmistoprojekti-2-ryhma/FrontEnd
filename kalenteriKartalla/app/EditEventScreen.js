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

    const handleSave = () => {
        if (!title.trim()) {
            Alert.alert("Error", "Please enter an event title.");
            return;
        }

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

    const formatDate = (dateObj) => {
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const formatTime = (dateObj) => {
        const hours = dateObj.getHours().toString().padStart(2, "0");
        const minutes = dateObj.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    return (
        <SafeAreaView style={styles.container}>
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10,
        color: "#333",
    },
    form: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    dateText: {
        fontSize: 16,
        marginBottom: 10,
        color: "#333",
    },
    changeButton: {
        backgroundColor: "#fa858f",
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 8,
        marginBottom: 15,
    },
    changeButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: "#fa858f",
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 8,
        marginBottom: 15,
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: "#ff4d4d",
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 8,
    },
    deleteButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
