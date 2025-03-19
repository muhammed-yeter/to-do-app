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

import { Shadow } from 'react-native-shadow-2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

const Edit = () => {
    const theme = useContext(themeContext);
    const router = useRouter();
    const { date, index } = useLocalSearchParams();

    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('routine');
    const [taskDate, setTaskDate] = useState(date || new Date().toLocaleDateString('en-CA'));
    const [taskTime, setTaskTime] = useState('');

    useEffect(() => {
        const loadTask = async () => {
            const tasks = await AsyncStorage.getItem('tasks');
            const tasksList = tasks ? JSON.parse(tasks) : {};
            const task = tasksList[taskDate][index];

            setTaskName(task.taskName);
            setTaskDescription(task.taskDescription);
            setSelectedPriority(task.taskPriority);
            setTaskTime(task.taskTime);
        };

        loadTask();
    }, [taskDate, index]);

    const updateTask = async () => {
        // Set default values if taskName or taskDescription are empty
        const taskNameToSave = taskName.trim() || "İsimsiz Görev";
        const taskDescriptionToSave = taskDescription.trim() || "Açıklama Yok";
        try {
            const tasks = await AsyncStorage.getItem('tasks');
            const tasksList = tasks ? JSON.parse(tasks) : {};
            tasksList[taskDate][index] = {
                taskName: taskNameToSave,
                taskDescription: taskDescriptionToSave,
                taskPriority: selectedPriority,
                taskTime,
            };

            await AsyncStorage.setItem('tasks', JSON.stringify(tasksList));

            router.push('/tasks');
        } catch (error) {
            console.error("Görev güncellenirken hata oluştu:", error);
        }
    };

    const taskDetails = {
        taskName: "",
        taskDescription: "",
        taskPriority: "routine",
        taskDate: "",
    };

    const selectOneItem = (priority) => setSelectedPriority(priority);

    return (
        <SafeAreaView style={[{ flex: 1 }, { backgroundColor: theme.bgColor3.backgroundColor }]}>
            <ScrollView style={{ flex: 1 }}>
                <SettingsHeader edit={true} taskDate={taskDate} getBackTo={"/tasks"} header={"Görevi Düzenle"} />
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
                                    defaultValue={taskTime}
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
                            onPress={() => {
                                updateTask(taskDate, taskDetails);
                            }}>
                            <Text style={{ fontSize: wp("4"), color: '#fff' }}>Görevi Güncelle</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >
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
