import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as MailComposer from 'expo-mail-composer';

import React, { useState, useContext } from 'react';
import themeContext from '../../theme/themeContext';

import SettingsHeader from "../../components/SettingsHeader";

import { Shadow } from 'react-native-shadow-2';
import LoadingScreen from '../../components/LoadingScreen';

const Report = () => {
    const [isLoading, setIsLoading] = useState(false);
    const theme = useContext(themeContext);

    const [fullName, setFullName] = useState('');
    const [problem, setProblem] = useState('');
    const [description, setDescription] = useState('');
    var fullSubject = "";

    const sendMail = async () => {
        if (!fullName.trim() || !problem.trim()) {
            Alert.alert("Uyarı", "Lütfen Gerekli Yerleri Eksiksiz Doldurun");
            return;
        }
        setIsLoading(true)
        fullSubject = fullName + " | " + problem;
        const options = {
            recipients: ['muhammedyeter4736@gmail.com'], // mail'in gönderileceği kişi
            subject: fullSubject,
            body: description,
        };
        const result = await MailComposer.composeAsync(options);
        setIsLoading(false)
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.bgColor3.backgroundColor }]} >
            <LoadingScreen visible={isLoading} isOverlay={true} />
            <ScrollView style={{ flex: 1 }}>
                <SettingsHeader getBackTo={"/settings"} header={"Sorun Bildir"} />
                <View style={styles.altContainer}>
                    <View style={styles.form}>
                        <View style={styles.row}>
                            <Text style={[{ fontSize: wp("3.5") }, styles.fontHandler, { color: theme.primaryText.color }]}>Ad</Text>
                            <TextInput
                                value={fullName}
                                onChangeText={setFullName}
                                maxLength={50}
                                placeholderTextColor={"#777"}
                                style={[styles.input, styles.fontHandler, { color: theme.primaryText.color }]}
                                placeholder="Tam adınızı girin" />
                        </View>
                        <View style={styles.row}>
                            <Text style={[{ fontSize: wp("3.5") }, styles.fontHandler, { color: theme.primaryText.color }]}>Başlık</Text>
                            <TextInput
                                multiline
                                value={problem}
                                onChangeText={setProblem}
                                maxLength={254}
                                placeholderTextColor={"#777"}
                                style={[styles.input, styles.fontHandler, { color: theme.primaryText.color }]}
                                placeholder="Başlığınızı girin" />
                        </View>
                        <View style={styles.row}>
                            <Text style={[{ fontSize: wp("3.5") }, styles.fontHandler, { color: theme.primaryText.color }]}>Açıklama</Text>
                            <TextInput
                                multiline
                                value={description}
                                onChangeText={setDescription}
                                maxLength={1000}
                                placeholderTextColor={"#777"}
                                style={[styles.input, styles.fontHandler, { color: theme.primaryText.color }]}
                                placeholder="Sorunu açıklayın" />
                        </View>
                        <View style={{ marginTop: hp("5") }}>
                            <Shadow
                                distance={5}
                                startColor="#00005520"
                                endColor="#00005501"
                                offset={[0, 5]}
                                style={{ width: "100%" }}
                            >
                                <TouchableOpacity style={styles.sendReport}
                                    onPress={() => {
                                        sendMail();
                                    }}>
                                    <Text style={styles.sendReportText}>Gönder</Text>
                                </TouchableOpacity>
                            </Shadow>
                        </View>
                    </View >
                </View>
            </ScrollView>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "flex-start",
        flex: 1,
    },
    altContainer: {
        paddingHorizontal: wp('5%'),
        paddingBottom: hp('10%'),
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: "#777777",
        padding: 10,
    },
    form: {
        gap: hp("7"),
    },
    row: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: hp("1"),
    },
    sendReport: {
        backgroundColor: '#6255D3',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: wp("3.5"),
        color: '#fff',
        paddingVertical: hp("2"),
        borderRadius: 10,
    },
    sendReportText: {
        fontSize: wp("3.5"),
        color: '#fff',
    },
    fontHandler:
    {
        fontFamily: "League Spartan"
    }
});


export default Report;