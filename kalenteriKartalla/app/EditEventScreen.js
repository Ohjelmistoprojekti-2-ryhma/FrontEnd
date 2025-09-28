import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";

export default function EditEventScreen({ navigation, route }) {
    const { event, onSaveEdit, onDelete } = route.params;
    const [title, setTitle] = useState(event.title);

    const handleSave = () => {
        if (!title.trim()) {
            Alert.alert("Error", "Please enter an event title.");
            return;
        }
        onSaveEdit({ ...event, title: title.trim() });
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

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Edit Event</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Event title"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Delete Event</Text>
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
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
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
