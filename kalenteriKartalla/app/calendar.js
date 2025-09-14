// CalendarScreen.js
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
        { id: 1, date: "2025-09-14", title: "Coffee with friends" },
        { id: 2, date: "2025-09-15", title: "Student event" },
    ]);

    const [selectedDate, setSelectedDate] = useState("2025-09-14");

    useEffect(() => {
        if (route.params?.newEvent) {
            setEvents((prev) => [...prev, route.params.newEvent]);
        }
    }, [route.params?.newEvent]);

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
                        renderItem={({ item }) => <Text>- {item.title}</Text>}
                    />
                ) : (
                    <Text>No events for today</Text>
                )}
            </View>

            {/* Button to Add Event */}
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
