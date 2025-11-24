import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import calendarStyles from "../components/CalendarStyles";
import holidays from "../data/holidays.json";
import { loadEvents, saveEvents } from "../app/storage";
import * as Contacts from 'expo-contacts';
import { useTheme } from "../components/ThemeContext";

export default function CalendarScreen({ navigation, route }) {
  const [events, setEvents] = useState([]);

  const { darkmode } = useTheme();
  const styles = calendarStyles(darkmode);

  // Set date to the current date by default
  const [selectedDate, setSelectedDate] = useState((() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  })());

  const [mapKey, setMapKey] = useState(0);

  //Request contacts
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.FirstName, Contacts.Fields.LastName],
        });
        if (data.length > 0) {
          setContacts(data);
        } else {
          Alert.alert("Warning", "No contacts found.");
        }
      }
    })();
  }, []);

  // Load events
  useEffect(() => {
    loadEvents().then((saved) => {
      if (saved) {
        setEvents(saved);
        console.log("Loaded events:", saved);
      }
    });
  }, []);

  // Save events on change
  useEffect(() => {
    saveEvents(events);
  }, [events]);

  // Delete event
  const deleteEvent = (eventId) => {
    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.filter((event) => event.id !== eventId);
      console.log("Event deleted:", eventId);
      return updatedEvents;
    });

    // Update map render key
    setMapKey((prevKey) => prevKey + 1);
  };

  // Add new event from AddEventScreen
  useEffect(() => {
    if (route.params?.newEvent) {
      setEvents((prev) => [...prev, route.params.newEvent]);
      console.log("New event added:", route.params.newEvent);
    }
  }, [route.params?.newEvent]);

  // Filter events for selected date and sort by time
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

  // Mark holidays
  const holidayMarks = Object.values(holidays)
    .flat()
    .reduce((acc, holiday) => {
      acc[holiday.date] = {
        customStyles: {
          text: { color: "red" }
        },

        ...(selectedDate === holiday.date ? {
          selected: true, selectedColor: "#fa858f",
          customStyles: {
            text: { color: "#fff" }
          }
        }
          : {}),
      };
      return acc;
    });

  const selectedHoliday = Object.values(holidays)
    .flat()
    .find((h) => h.date === selectedDate);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkmode ? "#121212" : "#fff" }}>
      {/* Calendar */}
      <Calendar
        markingType="custom"
        theme={{
          backgroundColor: darkmode ? "#121212" : "#fff",
          calendarBackground: darkmode ? "#121212" : "#fff",
          textSectionTitleColor: darkmode ? "#fff" : "#000",
          todayTextColor: "#fa858f",
          dayTextColor: darkmode ? "#fff" : "#000",
          monthTextColor: darkmode ? "#fff" : "#000",
          arrowColor: darkmode ? "#fff" : "#000",
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#fa858f" },

          ...holidayMarks,

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

        {/*Holidays*/}
        {selectedHoliday && (
          <View>
            <Text style={styles.holidayText}>
              {selectedHoliday.name_en}
            </Text>
          </View>
        )}

        {/*Events*/}
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
                    onSaveEdit: (updated) => {
                      setEvents((prev) =>
                        prev.map((e) => (e.id === updated.id ? updated : e))
                      );
                    },
                    onDelete: deleteEvent,
                    contacts: contacts,
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

                {item.contactName ? (
                  <Text style={styles.eventDescription}>
                    Contact: {item.contactName}
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
            location: null,
            allEvents: events,
            contacts: contacts,
          })
        }
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Update Map Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            bottom: 90,
            backgroundColor: "#4CAF50",
            justifyContent: "center",
            alignItems: "center",
            width: 140,
            borderRadius: 28,
          },
        ]}
        onPress={() =>
          navigation.navigate("Map", {
            key: mapKey, // forces WebView re-render
            events: events, // always pass up-to-date events
            eventTitle: "Event locations",
          })
        }
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Update map</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
