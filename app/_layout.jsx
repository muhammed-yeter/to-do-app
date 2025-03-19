import React, { useState, useEffect } from "react";
import { Tabs } from "expo-router";
import TabBar from "../components/TabBar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventRegister } from 'react-native-event-listeners';
import themeContext from "../theme/themeContext";
import theme from "../theme/theme";
import LoadingScreen from "../components/LoadingScreen";

const Layout = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [darkTheme, setDarkTheme] = useState(false);
    useEffect(() => {
        const loadData = async () => {
            try {
                const value = await AsyncStorage.getItem("app-theme");
                if (value !== null) {
                    const toBoolean = (variable) => variable.toLowerCase() === 'true';
                    setDarkTheme(toBoolean(value));
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false); // Yükleme tamamlandı
            }
        };
        loadData();

        const listener = EventRegister.addEventListener('ChangeTheme', (data) => {
            setDarkTheme(data);
        });

        return () => {
            EventRegister.removeAllListeners(listener);
        }
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
                tabBar={props => <TabBar {...props} />}>
                <Tabs.Screen
                    name="index"
                    options={{ headerShown: false, title: "Anasayfa", icon: "home" }} />
                <Tabs.Screen
                    name="tasks"
                    options={{ headerShown: false, title: "Görevlerim", icon: "calendar" }} />
                <Tabs.Screen
                    name="settings"
                    options={{ headerShown: false }} />
                <Tabs.Screen
                    name="settings/theme"
                    options={{ headerShown: false }} />
                <Tabs.Screen
                    name="settings/report"
                    options={{ headerShown: false }} />
                <Tabs.Screen
                    name="tasks/create"
                    options={{ headerShown: false }} />
                <Tabs.Screen
                    name="tasks/edit"
                    options={{ headerShown: false }} />
            </Tabs>
        </themeContext.Provider>
    );
}
export default Layout;
