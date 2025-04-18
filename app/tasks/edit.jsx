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

const Edit = () => {
    const theme = useContext(themeContext);
    const isFocused = useIsFocused();
    const router = useRouter();
    const { date: taskDate, index } = useLocalSearchParams();

    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedPriority, setselectedPriority] = useState("routine");
    const [taskTime, setTaskTime] = useState('');
    const [continueToSaving, setContinueToSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadTask();
    }, [isFocused]);

    useEffect(() => {
        const isValid = () => {
            const now = new Date();
            const target = new Date(`${taskDate}T${taskTime}:00`);
            return target > now;
        };
        setContinueToSaving(isValid());
    }, [taskTime]);

    const loadTask = async () => {
        const tasks = await AsyncStorage.getItem('tasks');
        const tasksList = tasks ? JSON.parse(tasks) : {};
        const task = tasksList[taskDate][index];
        setTaskName(task.taskName);
        setTaskDescription(task.taskDescription);
        setselectedPriority(task.taskPriority);
        setTaskTime(task.taskTime);
        console.log(taskTime)
    };

    const updateTask = async () => {
        const taskNameToSave = taskName.trim() || "İsimsiz Görev";
        const taskDescriptionToSave = taskDescription.trim() || "Açıklama Yok";
        const tasks = await AsyncStorage.getItem('tasks');
        const tasksList = tasks ? JSON.parse(tasks) : {};

        tasksList[taskDate][index] = {
            ...tasksList[taskDate][index],
            taskName: taskNameToSave,
            taskDescription: taskDescriptionToSave,
            taskPriority: selectedPriority,
            taskTime: taskTime,
            isEnabled: true,
        };

        await AsyncStorage.setItem('tasks', JSON.stringify(tasksList));
        router.push('/tasks');
    };

    const selectOneItem = (priority) => setselectedPriority(priority);


    const DynamicCreateButton = continueToSaving ? TouchableOpacity : View;

    return (
        <SafeAreaView style={[{ flex: 1 }, { backgroundColor: theme.bgColor3.backgroundColor }]}>
            <LoadingScreen visible={isLoading} isOverlay={true} />
            <SettingsHeader
                getBackTo={"/tasks"}
                header={"Görevi Düzenle"}
                selectedDate={taskDate}
                edit={true}
                taskIndex={index}
            />
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.altContainer}>
                    <View style={styles.content}>
                        {/* Takvim */}
                        <View key={theme.theme}>
                            <Text style={[styles.header, { color: theme.primaryText.color, textAlign: "center", paddingBottom: hp("2") }]}>Görev Tarihi</Text>
                            <Shadow style={{ width: "100%" }}>
                                <Calendar
                                    style={{ borderRadius: 10 }}
                                    theme={{
                                        calendarBackground: theme.bgColor1.backgroundColor,
                                        textSectionTitleColor: theme.calendarMonth.color,
                                        selectedDayTextColor: "#fff",
                                        todayTextColor: '#FF744F',
                                        dayTextColor: theme.primaryText.color,
                                        textDisabledColor: theme.calendarDisabled.color,
                                        arrowColor: '#C26061',
                                        monthTextColor: theme.primaryText.color,
                                        indicatorColor: theme.primaryText.color,
                                        textDayFontSize: wp("3.5"),
                                        textMonthFontSize: wp("3.5"),
                                        textDayHeaderFontSize: wp("3.5"),
                                    }}
                                    onDayPress={day => setTaskDate(day.dateString)}
                                    markedDates={{
                                        [taskDate]: { selected: true, selectedColor: '#6255D3' },
                                    }}
                                />
                            </Shadow>
                        </View>
                        {/* Saat, Ad, Açıklama */}
                        <View style={styles.row}>
                            <Text style={[styles.header, { color: theme.primaryText.color }]}>Görev Saati</Text>
                            <View style={[styles.setTime, { backgroundColor: theme.bgColor1.backgroundColor }]}>
                                <PickTime defaultValue={taskTime} onTimeChange={(time) => setTimeout(() => setTaskTime(time), 0)} />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <Text style={[styles.header, { color: theme.primaryText.color }]}>Görev Adı</Text>
                            <TextInput value={taskName} onChangeText={setTaskName} maxLength={50}
                                placeholder="(ör.) Haftalık Toplantı"
                                placeholderTextColor={theme.secondaryText.color}
                                style={[styles.input, { color: theme.primaryText.color }]} />
                        </View>

                        <View style={styles.row}>
                            <Text style={[styles.header, { color: theme.primaryText.color }]}>Görev Açıklaması</Text>
                            <TextInput multiline value={taskDescription} onChangeText={setTaskDescription} maxLength={200}
                                placeholder="(ör.) Maaş Görüşmesi"
                                placeholderTextColor={theme.secondaryText.color}
                                style={[styles.input, { color: theme.primaryText.color }]} />
                        </View>

                        {/* Öncelik */}
                        <View style={styles.prioritySetter}>
                            <Text style={[styles.header, { color: theme.primaryText.color }]}>Görev Önceliği</Text>
                            <RadioButton priority={"routine"} onSelect={() => selectOneItem("routine")} isSelected={selectedPriority === "routine"} />
                            <RadioButton priority={"important"} onSelect={() => selectOneItem("important")} isSelected={selectedPriority === "important"} />
                            <RadioButton priority={"primary"} onSelect={() => selectOneItem("primary")} isSelected={selectedPriority === "primary"} />
                        </View>

                        {/* Buton */}
                        <View style={{ display: "flex", gap: wp("2") }}>
                            {!continueToSaving && (
                                <Text style={{ fontSize: wp("4"), color: "#EB5757" }}>
                                    * Lütfen geçerli bir saat seçiniz.
                                </Text>
                            )}

                            <DynamicCreateButton style={[styles.createTask, { backgroundColor: continueToSaving ? theme.interactItem.backgroundColor : "#968CFF90" }]}
                                onPress={async () => {
                                    setIsLoading(true);
                                    await updateTask();
                                    setIsLoading(false);
                                }}>
                                <Text style={{ fontSize: wp("4"), color: '#fff' }}>Düzenlemeleri Kaydet</Text>
                            </DynamicCreateButton>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};


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

export default Edit;
