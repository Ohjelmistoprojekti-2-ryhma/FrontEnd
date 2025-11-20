import { StyleSheet } from 'react-native';

const addEventStyles = StyleSheet.create({
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
        backgroundColor: "#ddd",
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 8,
        marginBottom: 20,
    },
    locationButtonText: {
        color: "#333",
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
    },
    picker: {
        height: 50,
        width: "100%"
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

export default addEventStyles;