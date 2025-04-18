import {
    StyleSheet,
    View,
    Text,
    ScrollView,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SettingsMenuItem from '../components/SettingsMenuItem';
import React, { useContext } from 'react';
import themeContext from '../theme/themeContext';

import Ionicons from '@expo/vector-icons/Ionicons';
import SettingsHeader from "../components/SettingsHeader";

const logo = require("../assets/images/logo.png");
const Settings = () => {

    const theme = useContext(themeContext);
    var test = 0;
    return (
        <View style={[styles.container, { backgroundColor: theme.bgColor3.backgroundColor }]}>
            <ScrollView style={{ width: "100%", height: "100%", }}>
                <SettingsHeader getBackTo={"/"} header={"Seçenekler"} />
                <View style={styles.altContainer}>
                    <View style={styles.content}>
                        <View style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                            <Ionicons name="water-outline" size={100} color={"#7547E3"} />
                            <Text style={[styles.headerText, { color: "#7547E3", fontSize: 40 }]}>Lyncia</Text>
                        </View>
                        <View style={styles.menu}>
                            <SettingsMenuItem
                                header="Temayı Değiştir"
                                icon="palette"
                                locateTo="settings/theme" />

                            <SettingsMenuItem
                                header="Sorun Bildir"
                                icon="report"
                                locateTo="settings/report" />

                            <SettingsMenuItem
                                header="Verilerimi Temizle"
                                icon="delete"
                                dataController={true}
                                locateTo="/" />

                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    altContainer: {
        paddingHorizontal: wp('5%'),
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
        gap: hp("10"),
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
        gap: hp("2")
    }
})
export default Settings;