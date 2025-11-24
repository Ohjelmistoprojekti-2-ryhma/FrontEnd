import { StyleSheet } from 'react-native';

export default function CalendarStyles(darkmode) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: darkmode ? "#121212" : "#fff",
        },
        eventList: {
            padding: 10,
            backgroundColor: darkmode ? "#000" : "#f5f5f5",
            flex: 1,
        },
        title: {
            fontWeight: "bold",
            marginBottom: 10,
            fontSize: 16,
            color: darkmode ? "#fff" : "#000",
        },
        eventItem: {
            backgroundColor: darkmode ? "#121212" : "#fff",
            padding: 12,
            borderRadius: 10,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: darkmode ? "#333" : "#ddd",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: darkmode ? 0 : 1,
        },
        eventText: {
            fontSize: 16,
            color: darkmode ? "#fff" : "#333",
            fontWeight: "500",
        },
        holidayText: {
            fontSize: 16,
            color: "#ff6b6b",
            fontWeight: "500",
            marginBottom: 10,
        },
        eventDescription: {
            fontSize: 14,
            color: darkmode ? "#aaa" : "#666",
            marginTop: 4,
            marginLeft: 5,
        },
        noEvents: {
            color: darkmode ? "#aaa" : "#888",
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
    });
}

