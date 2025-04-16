import { View, StyleSheet, Text } from 'react-native';
import { Link, Stack } from 'expo-router';
import themeContext from '../theme/themeContext';
import React, { useContext } from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function NotFoundScreen() {
    const theme = useContext(themeContext);
    return (
        <>
            <View style={[styles.container, { backgroundColor: theme.bgColor3.backgroundColor }]}>
                <View style={[styles.container, { width: "90%" }]}>
                    <Text style={{ color: theme.primaryText.color, fontSize: wp("6.5") }}>Bu içerik görüntülenemiyor</Text>
                    <Text style={[styles.textContent, { color: theme.primaryText.color }]}>Sorun devam ederse <Link href="settings/report" style={styles.button}> Sorun Bildir </Link>Sayfasından iletmeyi unutma. Şimdilik anasayfaya dönmeyi deneyebilirsin.</Text>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    button: {
        fontSize: wp("3.5"),
        textDecorationLine: 'underline',
        color: '#FF4949',
    },
    textContent: {
        fontSize: wp("3.5"),
        textAlign: "center",
        color: '#dedede',
    },
});
