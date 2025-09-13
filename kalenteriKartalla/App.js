import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Map from "./app/map";
import CalendarScreen from "./app/calendar";


// Alustava navigointi, tätä voi muuttaa vielä !!!

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Calendar" component={CalendarScreen} />
                <Tab.Screen name="Map" component={Map} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
