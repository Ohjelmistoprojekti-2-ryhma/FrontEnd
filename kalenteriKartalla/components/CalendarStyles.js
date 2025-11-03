import { StyleSheet } from 'react-native';

const calendarStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    eventList: {
        padding: 10,
        backgroundColor: "#f5f5f5",
        flex: 1,
    },
    title: {
        fontWeight: "bold",
        marginBottom: 10,
        fontSize: 16,
    },
    eventItem: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    eventText: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    eventDescription: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
        marginLeft: 5,
    },
    noEvents: {
        color: "#888",
        textAlign: "center",
        marginTop: 20,
    },
    fab: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#fa858f",
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
    },
    fabText: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "bold",
    },
})

export default calendarStyles;