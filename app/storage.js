import AsyncStorage from "@react-native-async-storage/async-storage";

const EVENTS_KEY = "EVENTS_DATA";

// Load full event list
export async function loadEvents() {
  try {
    const json = await AsyncStorage.getItem(EVENTS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (err) {
    console.error("Error loading events:", err);
    return [];
  }
}

// Save full event list
export async function saveEvents(events) {
  try {
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (err) {
    console.error("Error saving events:", err);
  }
}