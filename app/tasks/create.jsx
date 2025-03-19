import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import { Calendar } from 'react-native-calendars';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import React, { useState, useContext, useEffect } from 'react';
import themeContext from '../../theme/themeContext';

import SettingsHeader from "../../components/SettingsHeader";
import RadioButton from "../../components/RadioButton";

import PickTime from "../../components/PickTime";
import { useIsFocused } from '@react-navigation/native';

import { Shadow } from 'react-native-shadow-2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import LoadingScreen from '../../components/LoadingScreen';
import * as Notifications from 'expo-notifications';

const combineDateTime = (date, time) => {
    const [hour, minute] = time.split(":").map(Number); // PickTime'den gelen saat ve dakika
    const [year, month, day] = date.split("-").map(Number); // Calendar'dan gelen tarih
    return new Date(year, month - 1, day, hour, minute); // Yeni Date objesi
};

const setAlarm = async (taskDate, taskTime, taskName) => {
    const fullDate = combineDateTime(taskDate, taskTime);
    console.log("Full Date:", fullDate);

    const timestamp = fullDate.getTime(); // Milisaniyeye çevir
    console.log("Timestamp:", timestamp);

    // Expo'nun yeni gereksinimine uygun format
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Görev Hatırlatma",
            body: `${taskName} görev zamanı geldi!`,
            sound: true,
        },
        trigger: {
            type: 'date', // `type` alanını belirtmek zorundayız
            timestamp: Date.now() + 5000, // Milisaniye cinsinden zaman
        },
    });
};

const testAlarm = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Test Bildirimi",
            body: "Bu bir test mesajıdır!",
            sound: true,
        },
        trigger: {
            seconds: 5, // Şu andan itibaren 5 saniye sonra
        },
    });

}



// setAlarm fonksiyonunu bu şekilde çağırın:


const Create = () => {

    const getPushToken = async () => {
        try {
            console.log("Push token alınıyor...");
            const tokenData = await Notifications.getExpoPushTokenAsync();
            console.log("Expo Push Token:", tokenData.data);
        } catch (error) {
            console.error("Push token alırken hata oluştu:", error);
        }
    };
    getPushToken();

    const theme = useContext(themeContext);
    const isFocused = useIsFocused();
    const currentDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD formatında alır

    const router = useRouter();
    const { date } = useLocalSearchParams();

    const saveTaskData = async (date, task) => {
        const tasks = await AsyncStorage.getItem('tasks'); // Mevcut tüm görevleri al
        const tasksList = tasks ? JSON.parse(tasks) : {};  // JSON formatına çevir veya boş obje
        if (!tasksList[date]) tasksList[date] = [];                   // Eğer seçilen tarihte görev yoksa boş liste oluştur
        tasksList[date].push(task);                                // Görevi seçilen tarihe ekle
        await AsyncStorage.setItem('tasks', JSON.stringify(tasksList)); // Güncellenen görevleri kaydet
    };

    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedPriority, setselectedPriority] = useState("routine");
    const [taskDate, setTaskDate] = useState(currentDate);
    const [taskTime, setTaskTime] = useState('');

    useEffect(() => {
        setTaskName("");
        setTaskDescription("");
        setTaskDate(date);

        const requestPermissions = async () => {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                const { status: newStatus } = await Notifications.requestPermissionsAsync();
                if (newStatus !== 'granted') {
                    alert('Bildirim izni verilmedi!');
                }
            }
        };

        requestPermissions();
    }, [isFocused]);

    const selectOneItem = (priority) => {
        setselectedPriority(priority);
        taskDetails.taskPriority = priority;
    };

    const taskDetails = {
        taskName: "",
        taskDescription: "",
        taskPriority: "routine",
        taskDate: "",
        taskTime: "",
    };

    function packData() {
        taskDetails.taskName = taskName.trim() || "İsimsiz Görev";
        taskDetails.taskDescription = taskDescription.trim() || "Açıklama Yok";
        taskDetails.taskPriority = selectedPriority;
        taskDetails.taskDate = taskDate;
        taskDetails.taskTime = taskTime;
    }

    const [isLoading, setIsLoading] = useState(false);
    return (
        <SafeAreaView style={[{ flex: 1 }, { backgroundColor: theme.bgColor3.backgroundColor }]}>
            <LoadingScreen visible={isLoading} isOverlay={true} />
            <ScrollView style={{ flex: 1 }}>
                <SettingsHeader getBackTo={"/tasks"} header={"Görev Oluştur"} />
                <View style={styles.altContainer}>
                    <View style={styles.content}>
                        <View key={theme.theme}>
                            <Text
                                style={[styles.header, {
                                    color: theme.primaryText.color,
                                    textAlign: "center",
                                    paddingBottom: hp("2"),
                                    width: "100%",
                                }]} >Görev Tarihi</Text>
                            <Shadow
                                distance={8}
                                startColor="#00005515"
                                endColor="#00005501"
                                style={{ width: "100%" }}
                            >
                                <Calendar
                                    style={{ borderRadius: 10, }}
                                    theme={{
                                        calendarBackground: theme.bgColor1.backgroundColor,
                                        textSectionTitleColor: theme.calendarMonth.color,
                                        selectedDayTextColor: "#fff",
                                        todayTextColor: '#FF4949',
                                        dayTextColor: theme.primaryText.color,
                                        textDisabledColor: '#666666',
                                        arrowColor: '#C26061',
                                        monthTextColor: theme.primaryText.color,
                                        indicatorColor: theme.primaryText.color,
                                        textDayFontSize: wp("3.5"),
                                        textMonthFontSize: wp("3.5"),
                                        textDayHeaderFontSize: wp("3.5"),
                                    }}
                                    onDayPress={day => {
                                        setTaskDate(day.dateString);
                                    }}
                                    markedDates={{
                                        [taskDate]: {
                                            selected: true,
                                            selectedColor: '#6255D3',
                                        },
                                    }}
                                />
                            </Shadow>
                        </View>

                        <View style={styles.row}>
                            <Text style={[styles.header, { color: theme.primaryText.color }]}>Görev Saati</Text>
                            <View style={[styles.setTime, { backgroundColor: theme.bgColor1.backgroundColor }]}>
                                <PickTime
                                    style={{ elevation: 8 }}

                                    onTimeChange={(time) => {
                                        setTaskTime(time);
                                    }} />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <Text style={[styles.header, { color: theme.primaryText.color }]}>Görev Adı</Text>
                            <View>
                                <Text style={{ fontSize: wp("3"), color: theme.secondaryText.color }}>* En Fazla 50 Karakter</Text>
                                <TextInput
                                    value={taskName}
                                    onChangeText={setTaskName}
                                    maxLength={50}
                                    placeholderTextColor={theme.secondaryText.color}
                                    style={[styles.input, { color: theme.primaryText.color }]}
                                    placeholder="(ör.) Haftalık Toplantı" />
                            </View>
                        </View>
                        <View style={styles.row}>
                            <Text style={[styles.header, { color: theme.primaryText.color }]}>Görev Açıklaması</Text>
                            <View>
                                <Text style={{ fontSize: wp("3"), color: theme.secondaryText.color }}>* En Fazla 200 Karakter</Text>
                                <TextInput
                                    multiline
                                    value={taskDescription}
                                    onChangeText={setTaskDescription}
                                    maxLength={200}
                                    placeholderTextColor={theme.secondaryText.color}
                                    style={[styles.input, { color: theme.primaryText.color }]}
                                    placeholder="(ör.) Maaş Yenilenmesi İçin Patronla Görüş" />
                            </View>
                        </View>
                        <View style={styles.prioritySetter}>
                            <Text style={[styles.header, {
                                color: theme.primaryText.color,
                                paddingBottom: hp("2"),
                            }]}>Görev Önceliği</Text>
                            <RadioButton
                                priority={"routine"}
                                onSelect={() => { taskDetails.taskPriority = "routine"; selectOneItem("routine"); }}
                                isSelected={selectedPriority === "routine"}
                            />
                            <RadioButton
                                priority={"important"}
                                onSelect={() => { taskDetails.taskPriority = "routine"; selectOneItem("important"); }}
                                isSelected={selectedPriority === "important"}
                            />
                            <RadioButton
                                priority={"primary"}
                                onSelect={() => { taskDetails.taskPriority = "primary"; selectOneItem("primary"); }}
                                isSelected={selectedPriority === "primary"}
                            />
                        </View>
                        <TouchableOpacity style={styles.createTask}
                            onPress={async () => {

                                setIsLoading(true);
                                packData();
                                await saveTaskData(taskDate, taskDetails);
                                testAlarm();
                                // await setAlarm(taskDate, taskTime, taskName);
                                setIsLoading(false);
                                router.push({
                                    pathname: 'tasks',
                                    params: { date: taskDate },
                                });
                            }}>

                            <Text style={{ fontSize: wp("4"), color: '#fff' }}>Görevi Oluştur</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({

    altContainer: {
        paddingHorizontal: wp('5%'),
        paddingBottom: hp('10%'),
        display: "flex",
    },

    content: {
        gap: hp('7%'),
        display: "flex",
        paddingTop: hp('5%'),
    },
    taskProps: {
        display: "flex",
        gap: 10,
        flexDirection: "column",
        justifyContent: "center",
    },
    prioritySetter: {
        display: "flex",
        flexDirection: "column",
        gap: hp("2"),
    },

    header: {
        fontSize: wp("5"),
    },

    row: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: hp("2"),
    },

    input: {
        borderBottomWidth: 2,
        borderBottomColor: "#6255D3",
        padding: 10,
        fontSize: wp("3.5"),
    },

    createTask: {
        backgroundColor: '#6255D3',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: wp("4"),
        color: '#fff',
        paddingVertical: hp("2"),
        borderRadius: 10,
    },

    datePick: {
        backgroundColor: "red",
        padding: 20,
    },

    setTime: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: wp("5"),
        borderRadius: 10,
        paddingHorizontal: wp("2"),
        paddingVertical: hp("2"),
    }
});

export default Create;
