import React from "react";
import { View, Text, Switch } from "react-native";
import { useTheme } from "../components/ThemeContext";

export default function SettingsScreen() {
    const { darkmode, setDarkmode } = useTheme();

    return (
        <View
            style={{
                flex: 1,
                padding: 20,
                backgroundColor: darkmode ? "#121212" : "#fff",
            }}
        >
            <Text
                style={{
                    fontSize: 22,
                    color: darkmode ? "#fff" : "#000",
                    marginBottom: 20,
                }}
            >
                Settings
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                    style={{
                        fontSize: 18,
                        color: darkmode ? "#fff" : "#000",
                        marginRight: 10,
                    }}
                >
                    Dark mode
                </Text>

                <Switch
                    value={darkmode}
                    onValueChange={(v) => setDarkmode(v)}
                />
            </View>
        </View>
    );
}
