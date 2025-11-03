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
import calendarStyles from "../components/CalendarStyles";

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
        <SafeAreaView style={calendarStyles.container}>
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
            <View style={calendarStyles.eventList}>
                <Text style={calendarStyles.title}>
                    Events on {formatDate(selectedDate)}:
                </Text>

                {selectedEvents.length > 0 ? (
                    <FlatList
                        data={selectedEvents}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={calendarStyles.eventItem}
                                onPress={() =>
                                    navigation.navigate("EditEvent", {
                                        event: item,
                                        onSaveEdit: editEvent,
                                        onDelete: deleteEvent,
                                    })
                                }
                            >
                                <Text style={calendarStyles.eventText}>
                                    {item.title}
                                    {item.time ? ` at ${item.time}` : ""}
                                </Text>
                                {item.description ? (
                                    <Text style={calendarStyles.eventDescription}>
                                        {item.description}
                                    </Text>
                                ) : null}
                            </TouchableOpacity>
                        )}
                    />
                ) : (
                    <Text style={calendarStyles.noEvents}>No events for this day</Text>
                )}
            </View>

            {/* Add Event Button */}
            <TouchableOpacity
                style={calendarStyles.fab}
                onPress={() =>
                    navigation.navigate("AddEvent", {
                        selectedDate,
                        onSave: (newEvent) => setEvents((prev) => [...prev, newEvent]),
                    })
                }
            >
                <Text style={calendarStyles.fabText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}


