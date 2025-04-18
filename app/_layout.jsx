import React, { useState, useEffect } from "react";
import { Tabs } from "expo-router";
import TabBar from "../components/TabBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import themeContext from "../theme/themeContext";
import theme from "../theme/theme";
import LoadingScreen from "../components/LoadingScreen";
import { useNavigationState } from "@react-navigation/native";
import { EventRegister } from "react-native-event-listeners";
import { startTaskChecker } from '../scripts/checkForNotification';
import * as Notifications from 'expo-notifications';
const Layout = () => {
    const navigationState = useNavigationState((state) => state);
    const route = navigationState?.routes?.[navigationState.index];
    const currentPage = route?.name || "unknown";

    const outOfSelectionPages = [
        "settings",
        "settings/theme",
        "settings/report",
        "tasks/create",
        "tasks/edit",
        "tasks/view",
    ];

    const [isLoading, setIsLoading] = useState(true);
    const [darkTheme, setDarkTheme] = useState(false);

    useEffect(() => {
        startTaskChecker();
        const askNotificationPermission = async () => {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                const { status: newStatus } = await Notifications.requestPermissionsAsync();
                if (newStatus !== 'granted') {
                    alert("Bildirim izni verilmedi");
                }
            }
        };

        askNotificationPermission();
    }, []);

    useEffect(() => {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }, []);

      
    useEffect(() => {
       
        const loadData = async () => {
            try {
                const value = await AsyncStorage.getItem("app-theme");
                if (value !== null) {
                    const toBoolean = (variable) => variable.toLowerCase() === "true";
                    setDarkTheme(toBoolean(value));
                }
                await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();

       
        const listener = EventRegister.addEventListener("ChangeTheme", (data) => {
            setDarkTheme(data);
        });

       
        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, []);

    if (isLoading) {
        return <LoadingScreen isOverlay={false} />;
    }

    return (
        <themeContext.Provider value={darkTheme ? theme.dark : theme.light}>
            <Tabs
                screenOptions={{
                    tabBarHideOnKeyboard: true,
                }}
                tabBar={(props) =>
                   
                    outOfSelectionPages.includes(currentPage) ? null : (
                        <TabBar {...props} />
                    )
                }
            >
                <Tabs.Screen
                    name="index"
                    options={{ headerShown: false, title: "Anasayfa", icon: "home" }}
                />
                <Tabs.Screen
                    name="tasks"
                    options={{ headerShown: false, title: "Görevlerim", icon: "calendar" }}
                />
                <Tabs.Screen name="settings" options={{ headerShown: false }} />
                <Tabs.Screen name="settings/theme" options={{ headerShown: false }} />
                <Tabs.Screen name="settings/report" options={{ headerShown: false }} />
                <Tabs.Screen name="tasks/create" options={{ headerShown: false }} />
                <Tabs.Screen name="tasks/edit" options={{ headerShown: false }} />
                <Tabs.Screen name="tasks/view" options={{ headerShown: false }} />

                <Tabs.Screen name="+not-found" options={{ headerShown: false }} />
            </Tabs>
        </themeContext.Provider>
    );
};

export const toggleTheme = (newTheme) => {
    EventRegister.emit("ChangeTheme", newTheme);
};

export default Layout;