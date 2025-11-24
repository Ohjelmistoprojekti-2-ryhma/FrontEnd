import { StyleSheet } from 'react-native';

export default function addEventStyles(darkmode) {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: darkmode ? "#121212" : "#fff",
        },
        label: {
            fontSize: 16,
            marginBottom: 10,
            color: darkmode ? "#fff" : "#000",
        },
        input: {
            borderWidth: 1,
            borderColor: darkmode ? "#938a8aff" : "#ccc",
            backgroundColor: darkmode ? "#111" : "#fff",
            color: darkmode ? "#fff" : "#000000",
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
            backgroundColor: darkmode ? "#333" : "#ddd",
            paddingVertical: 12,
            alignItems: "center",
            borderRadius: 8,
            marginBottom: 20,
        },
        locationButtonText: {
            color: darkmode ? "#fff" : "#333",
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
        pickerWrapper: {
            borderRadius: 8,
            borderWidth: 1,
            justifyContent: "center",
            marginBottom: 15,
            borderColor: darkmode ? "#555" : "#ccc"
        },
        picker: {
            height: 50,
            width: "100%",
            color: darkmode ? "#fff" : "#121212",
            backgroundColor: darkmode ? "#121212" : "#fff",
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
    });
}
