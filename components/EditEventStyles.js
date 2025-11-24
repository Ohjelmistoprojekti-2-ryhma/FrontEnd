import { StyleSheet } from 'react-native';

export default function editEventStyles(darkmode) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: darkmode ? "#121212" : "#fff",
        },
        header: {
            fontSize: 22,
            fontWeight: "bold",
            textAlign: "center",
            marginVertical: 10,
            color: darkmode ? "#fff" : "#333",
        },
        form: {
            padding: 20,
        },
        label: {
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 8,
            color: darkmode ? "#fff" : "#000",
        },
        input: {
            borderWidth: 1,
            borderColor: darkmode ? "#555" : "#ccc",
            backgroundColor: darkmode ? "#111" : "#fff",
            color: darkmode ? "#fff" : "#000",
            borderRadius: 8,
            padding: 10,
            marginBottom: 15,
        },
        dateText: {
            fontSize: 16,
            marginBottom: 10,
            color: darkmode ? "#fff" : "#333",
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
        }
    });
}

