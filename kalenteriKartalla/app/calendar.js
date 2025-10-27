import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarScreen({ navigation, route }) {
    const [events, setEvents] = useState([
        {
            id: 1,
            date: "2025-09-14",
            title: "Coffee with friends",
            time: "10:30",
            description: "Morning meetup at the café",
        },
        {
            id: 2,
            date: "2025-09-15",
            title: "Student event",
            time: "18:00",
            description: "Evening hangout at the campus park",
        },
    ]);

    const [selectedDate, setSelectedDate] = useState("2025-09-14");

    // Update event after editing
    const editEvent = (updatedEvent) => {
        setEvents((prev) =>
            prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
        );
    };

    // Delete event
    const deleteEvent = (eventId) => {
        setEvents((prev) => prev.filter((event) => event.id !== eventId));
    };

    // Add event from AddEventScreen
    useEffect(() => {
        if (route.params?.newEvent) {
            setEvents((prev) => [...prev, route.params.newEvent]);
        }
    }, [route.params?.newEvent]);

    // Filter and sort events by time
    const selectedEvents = events
        .filter((e) => e.date === selectedDate)
        .sort((a, b) => {
            if (!a.time) return 1;
            if (!b.time) return -1;
            return a.time.localeCompare(b.time);
        });

    const formatDate = (unformattedDate) => {
        const parts = unformattedDate.split("-");
        return `${parseInt(parts[2])}.${parseInt(parts[1])}.${parts[0]}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Calendar */}
            <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{
                    [selectedDate]: { selected: true, selectedColor: "#fa858f" },
                    ...events.reduce((acc, event) => {
                        acc[event.date] = {
                            marked: true,
                            dotColor: "#fa858f",
                            ...(selectedDate === event.date
                                ? { selected: true, selectedColor: "#fa858f" }
                                : {}),
                        };
                        return acc;
                    }, {}),
                }}
                firstDay={1}
            />

            {/* Event List */}
            <View style={styles.eventList}>
                <Text style={styles.title}>
                    Events on {formatDate(selectedDate)}:
                </Text>

                {selectedEvents.length > 0 ? (
                    <FlatList
                        data={selectedEvents}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.eventItem}
                                onPress={() =>
                                    navigation.navigate("EditEvent", {
                                        event: item,
                                        onSaveEdit: editEvent,
                                        onDelete: deleteEvent,
                                    })
                                }
                            >
                                <Text style={styles.eventText}>
                                    {item.title}
                                    {item.time ? ` at ${item.time}` : ""}
                                </Text>
                                {item.description ? (
                                    <Text style={styles.eventDescription}>
                                        {item.description}
                                    </Text>
                                ) : null}
                            </TouchableOpacity>
                        )}
                    />
                ) : (
                    <Text style={styles.noEvents}>No events for this day</Text>
                )}
            </View>

            {/* Add Event Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() =>
                    navigation.navigate("AddEvent", {
                        selectedDate,
                        onSave: (newEvent) => setEvents((prev) => [...prev, newEvent]),
                    })
                }
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

// Styles
const styles = StyleSheet.create({
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
});
