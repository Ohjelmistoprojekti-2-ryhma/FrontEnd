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
    </CalendarStack.Navigator>
  );
}

export default function App() {
  return (
  <NavigationContainer>
    <Tab.Navigator>
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
    </Tab.Navigator>
  </NavigationContainer>
);
}
