// App.js
import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Map from "./app/map";
import Calendar from "./app/calendar";
import AddEvent from "./app/AddEvent";
import EditEvent from "./app/EditEventScreen";
import { ThemeProvider } from "./components/ThemeContext";
import SettingsScreen from "./app/SettingsScreen";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { useTheme } from "./components/ThemeContext";



const Tab = createBottomTabNavigator();
const CalendarStack = createNativeStackNavigator();

function CalendarStackNavigator() {
  return (
    <CalendarStack.Navigator>
      <CalendarStack.Screen
        name="CalendarMain"
        component={Calendar}
        options={{ title: "My Calendar" }}
      />
      <CalendarStack.Screen
        name="AddEvent"
        component={AddEvent}
        options={{ title: "Add New Event" }}
      />
      <CalendarStack.Screen
        name="EditEvent"
        component={EditEvent}
        options={{ title: "Edit Event" }}
      />
      <CalendarStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
    </CalendarStack.Navigator>
  );
}

export default function App() {
  const { darkmode } = useTheme();
  return (
    <NavigationContainer theme={darkmode ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: darkmode ? "#121212" : "#fff",
          },
          headerTintColor: darkmode ? "#fff" : "#000",
          tabBarStyle: {
            backgroundColor: darkmode ? "#121212" : "#fff",
            borderTopColor: darkmode ? "#333" : "#ccc",
          },
          tabBarActiveTintColor: darkmode ? "#fff" : "#000",
          tabBarInactiveTintColor: darkmode ? "#888" : "#666",
        }}
      >
        <Tab.Screen
          name="Calendar"
          component={CalendarStackNavigator}
          options={{
            headerShown: false,
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>📅</Text>,
          }}
        />
        <Tab.Screen
          name="Map"
          component={Map}
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>🗺️</Text>,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>⚙️</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
