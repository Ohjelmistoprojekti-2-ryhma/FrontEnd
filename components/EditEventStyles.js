import { StyleSheet } from 'react-native';

const editEventStyles = StyleSheet.create({
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
    pickerWrapper: {
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: "center",
        marginBottom: 15,
    },
    picker: {
        height: 50,
        width: "100%"
    }
});

export default editEventStyles;