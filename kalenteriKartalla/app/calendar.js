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

// A few example events
export default function CalendarScreen({ navigation, route }) {
    const [events, setEvents] = useState([
        { id: 1, date: "2025-09-14", title: "Coffee with friends" },
        { id: 2, date: "2025-09-15", title: "Student event" },
    ]);


    // Default selected day
    const [selectedDate, setSelectedDate] = useState("2025-09-14");

    // Update event
    const editEvent = (updatedEvent) => {
        setEvents((prev) =>
            prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
        );
    };

    // Delete event
    const deleteEvent = (eventId) => {
        setEvents((prev) => prev.filter((event) => event.id !== eventId));
    };

    const selectedEvents = events.filter((e) => e.date === selectedDate);

    // Formatting the date:
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

            {/* Events */}
            <View style={styles.eventList}>
                <Text style={styles.title}>Events on {formatDate(selectedDate)}:</Text>
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
                                <Text style={styles.eventText}>- {item.title}</Text>
                            </TouchableOpacity>
                        )}
                    />
                ) : (
                    <Text>No events for today</Text>
                )}
            </View>

            {/* Button to add event */}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    eventList: {
        padding: 10,
        backgroundColor: "#f5f5f5",
        flex: 1,
    },
    title: {
        fontWeight: "bold",
        marginBottom: 5,
    },
    eventItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    eventText: {
        fontSize: 16,
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
