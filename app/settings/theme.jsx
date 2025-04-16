import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Octicons from '@expo/vector-icons/Octicons';

import { EventRegister } from 'react-native-event-listeners';
import React, { useState, useContext, useEffect } from 'react';
import themeContext from '../../theme/themeContext';

import SettingsHeader from "../../components/SettingsHeader";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Shadow } from 'react-native-shadow-2';
import LoadingScreen from '../../components/LoadingScreen';


const ChangeTheme = () => {
    const [darkTheme, setDarkTheme] = useState(false);
    const theme = useContext(themeContext);

    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const loadData = async () => {
            try {
                const value = await AsyncStorage.getItem("app-theme");
                if (value !== null) {
                    const toBoolean = (variable) => variable.toLowerCase() === 'true';
                    setDarkTheme(toBoolean(value));
                }
            } catch (e) {
                console.error(e);
            }
        };
        loadData();
    }, []);

    const saveData = async (itemName, value) => {
        try {
            await AsyncStorage.setItem(itemName, value.toString());
        } catch (e) {
            console.error(e);
        }
    };
    return (
        <View style={[styles.container, { backgroundColor: theme.bgColor3.backgroundColor }]}>
            <LoadingScreen visible={isLoading} isOverlay={true} />
            <SettingsHeader getBackTo={"/settings"} header={"Temayı Değiştir"} />
            <View style={styles.altContainer}>
                <View style={styles.content}>
                    <View style={styles.menu}>
                        <Shadow
                            distance={5}
                            startColor="#00005520"
                            endColor="#00005501"
                            offset={[0, 5]}
                            style={{ width: "100%" }}
                        >
                            <TouchableOpacity
                                style={[styles.themeSelector, { backgroundColor: theme.bgColor1.backgroundColor }]}
                                onPress={async () => {
                                    setIsLoading(true);
                                    setDarkTheme(false);
                                    await saveData('app-theme', 'false');
                                    await EventRegister.emit('ChangeTheme', false);
                                    setTimeout(() => {
                                        setIsLoading(false); // Yükleme ekranını kapat
                                    }, 10)
                                }}
                            >
                                <Octicons name="sun" size={30} color={darkTheme === false ? "#8775FF" : theme.primaryText.color} />
                                <Text style={{ color: darkTheme === false ? "#8775FF" : theme.primaryText.color, paddingVertical: 5, fontSize: wp("4") }}>
                                    Açık
                                </Text>
                            </TouchableOpacity>
                        </Shadow>

                        <Shadow
                            distance={5}
                            startColor="#00005520"
                            endColor="#00005501"
                            offset={[0, 5]}
                            style={{ width: "100%" }}
                        >
                            <TouchableOpacity
                                style={[styles.themeSelector, { backgroundColor: theme.bgColor1.backgroundColor }]}
                                onPress={async () => {
                                    setIsLoading(true);
                                    setDarkTheme(true);
                                    await saveData('app-theme', 'true');
                                    await EventRegister.emit('ChangeTheme', true);
                                    setTimeout(() => {
                                        setIsLoading(false); // Yükleme ekranını kapat
                                    }, 10)
                                }}
                            >
                                <Octicons name="moon" size={30} color={darkTheme === true ? "#8775FF" : theme.primaryText.color} />
                                <Text style={{ color: darkTheme === true ? "#8775FF" : theme.primaryText.color, paddingVertical: 5, fontSize: wp("4") }}>
                                    Koyu
                                </Text>
                            </TouchableOpacity>
                        </Shadow>
                    </View>
                </View>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "flex-start",
    },
    altContainer: {
        paddingHorizontal: wp('5%'),
        paddingBottom: hp('10%'),
        height: "100%"
    },

    textElement: { fontFamily: 'Regular' },
    content: {
        gap: hp('15%'),
        paddingTop: hp('5%'),
        height: hp('75%'),
        width: wp('90%'),

        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: hp("15"),
        alignItems: "center",
    },

    contentBottom: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
    },

    menu: {
        display: "flex",
        width: "100%",
        gap: hp("2"),
    },

    themeSelector: {
        borderRadius: 7,
        paddingHorizontal: wp('6%'),
        paddingVertical: hp('2%'),
        display: "flex",
        flexDirection: "row",
        gap: wp('3%'),
    }
})

export default ChangeTheme;
