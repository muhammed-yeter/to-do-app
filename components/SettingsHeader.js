import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import React, { useContext } from 'react';
import themeContext from '../theme/themeContext';
import { PlatformPressable } from '@react-navigation/elements';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SettingsHeader({ getBackTo, header, edit, taskDate }) {
    const theme = useContext(themeContext);
    const router = useRouter();

    return (
        <View style={styles.container}>
            <PlatformPressable hitSlop={{ top: 35, bottom: 35, left: 35, right: 35 }}
                onPress={() => router.push(getBackTo)} style={styles.getBack}>
                <FontAwesome5 name="chevron-left" size={28} color={theme.primaryText.color} />
            </PlatformPressable>
            <Text style={[styles.headerText, { color: theme.primaryText.color }]}>
                {header}
            </Text>
            {edit === true && (
                <TouchableOpacity style={styles.delete} hitSlop={{ top: 35, bottom: 35, left: 35, right: 35 }}
                    onPress={async () => {
                        await AsyncStorage.removeItem(taskDate);
                        router.push("tasks")
                        //ögeyi silme kodu
                    }}>
                    <FontAwesome5 name="trash" size={28} color={theme.primaryText.color} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: wp('6%'),
        position: 'relative',
    },
    getBack: {
        position: 'absolute',
        left: wp('6%'),
    },
    delete: {
        position: 'absolute',
        right: wp('6%'),
    },
    headerText: {
        fontSize: wp("6"),
    },
});
