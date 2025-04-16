import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import themeContext from '../theme/themeContext';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useIsFocused } from '@react-navigation/native';

const PickTime = ({ onTimeChange, defaultValue }) => {
    const theme = useContext(themeContext);
    const [pickerHour, setPickerHour] = useState(0);
    const [pickerMinute, setPickerMinute] = useState(0);

    const isFocused = useIsFocused();

    // Yardımcı fonksiyon
    const formatTime = (value) => value.toString().padStart(2, '0');

    useEffect(() => {
        if (isFocused) {
            if (defaultValue) {
                const [currentHour, currentMinute] = defaultValue.split(":").map(Number);
                setPickerHour(currentHour);
                setPickerMinute(currentMinute);
                onTimeChange(defaultValue);
            }
            else {
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();
                setPickerHour(currentHour);
                setPickerMinute(currentMinute);
                onTimeChange(`${formatTime(currentHour)}:${formatTime(currentMinute)}`);
            }
        }
    }, [isFocused, defaultValue]);

    const incrementHours = () => {
        setPickerHour((prev) => {
            const newHour = (prev + 1) % 24;
            onTimeChange(`${formatTime(newHour)}:${formatTime(pickerMinute)}`);
            return newHour;
        });
    };


    const decrementHours = () => {
        setPickerHour((prev) => {
            const newHour = (prev - 1 + 24) % 24;
            onTimeChange(`${formatTime(newHour)}:${formatTime(pickerMinute)}`);
            return newHour;
        });
    };

    const incrementMinutes = () => {
        setPickerMinute((prev) => {
            const newMinute = (prev + 1) % 60;
            onTimeChange(`${formatTime(pickerHour)}:${formatTime(newMinute)}`);
            return newMinute;
        });
    };

    const decrementMinutes = () => {
        setPickerMinute((prev) => {
            const newMinute = (prev - 1 + 60) % 60; // +60 eklenerek negatif değerler önlenir
            onTimeChange(`${formatTime(pickerHour)}:${formatTime(newMinute)}`);
            return newMinute;
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.setter}>
                <TouchableOpacity onPress={decrementHours} hitSlop={styles.hitSlop}>
                    <FontAwesome5 name="angle-left" size={36} color="#6255D3" />
                </TouchableOpacity>
                <Text style={[styles.time, { backgroundColor: theme.bgColor2.backgroundColor, color: theme.primaryText.color }]}>
                    {formatTime(pickerHour)}
                </Text>
                <TouchableOpacity onPress={incrementHours} hitSlop={styles.hitSlop}>
                    <FontAwesome5 name="angle-right" size={36} color="#6255D3" />
                </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 36, color: theme.primaryText.color }}>:</Text>
            <View style={styles.setter}>
                <TouchableOpacity onPress={decrementMinutes} hitSlop={styles.hitSlop}>
                    <FontAwesome5 name="angle-left" size={36} color="#6255D3" />
                </TouchableOpacity>
                <Text style={[styles.time, { backgroundColor: theme.bgColor2.backgroundColor, color: theme.primaryText.color }]}>
                    {formatTime(pickerMinute)}
                </Text>
                <TouchableOpacity onPress={incrementMinutes} hitSlop={styles.hitSlop}>
                    <FontAwesome5 name="angle-right" size={36} color="#6255D3" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: wp("5"),
    },
    setter: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: wp("2"),
    },
    time: {
        fontSize: 36,
        borderRadius: 10,
        padding: wp("2"),
    },
    hitSlop: {
        top: 30,
        bottom: 30,
        left: 30,
        right: 30,
    },
});

export default PickTime;
