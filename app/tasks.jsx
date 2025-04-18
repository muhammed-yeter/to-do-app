import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../components/Header';
import SoonMenuItem from '../components/SoonMenuItem';
import { Calendar } from 'react-native-calendars';
import React, { useContext, useEffect, useState } from 'react';
import themeContext from '../theme/themeContext';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../components/LoadingScreen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import NotificationListener from "../scripts/notificationListener"

const Tasks = () => {
    const theme = useContext(themeContext);
    const router = useRouter();
    const isFocused = useIsFocused();
    const currentDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD formatında alır
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [tasks, setTasks] = useState([]);
    const [markedDates, setMarkedDates] = useState("");
    const [orderType, setOrderType] = useState("byTime");

    const [isLoading, setIsLoading] = useState(false);
    const { date } = useLocalSearchParams();

    const loadTaskData = async (date) => {
        try {
            const tasks = await AsyncStorage.getItem('tasks');
            const tasksList = tasks ? JSON.parse(tasks) : {};
            return tasksList[date] || [];
        } catch (e) {
            console.error("Görev yüklenirken hata oluştu:", e);
            return [];
        }
    };

    const updateMarkedDates = async () => {
        try {
            const tasks = await AsyncStorage.getItem('tasks');
            const tasksList = tasks ? JSON.parse(tasks) : {};

            let newMarkedDates = {};

            Object.keys(tasksList).forEach(date => {
                const dayTasks = tasksList[date];

                if (Array.isArray(dayTasks)) { // dizi ise oluşturur
                    const dots = [];

                    if (dayTasks.some(task => task.taskPriority === "routine")) {
                        dots.push({ color: "#1ABB9A" });
                    }
                    if (dayTasks.some(task => task.taskPriority === "important")) {
                        dots.push({ color: "#FFD562" });
                    }
                    if (dayTasks.some(task => task.taskPriority === "primary")) {
                        dots.push({ color: "#FF7676" });
                    }

                    if (dots.length > 0) {
                        newMarkedDates[date] = {
                            dots: dots.slice(0, 3), // en fazla 3 nokta göstermek için 
                        };
                    }
                } else {
                    console.warn(`Beklenmeyen format: dayTasks bir dizi değil, Date: ${date}`);
                }
            });

            setMarkedDates(newMarkedDates);
        } catch (error) {
            console.error("Takvim işaretleri güncellenirken hata oluştu:", error);
        }
    };

    const disableOldTasks = async () => {
        try {
            const now = new Date();
            const tasks = await loadTaskData(selectedDate);

            const updatedTasks = tasks.map(task => {
                const taskDateTime = new Date(`${task.taskDate}T${task.taskTime}`);
                if (taskDateTime <= now) {
                    return { ...task, isEnabled: false };
                }
                return { ...task, isEnabled: true };
            });
            setTasks(updatedTasks);
            const storedTasks = await AsyncStorage.getItem('tasks');
            const parsedTaskList = storedTasks ? JSON.parse(storedTasks) : {};
            parsedTaskList[selectedDate] = updatedTasks;
            await AsyncStorage.setItem('tasks', JSON.stringify(parsedTaskList));
        } catch (error) {
            console.error("An error occurred while updating expired tasks:", error);
        }
    };

    const loadTasks = async (date) => {
        setIsLoading(true);
        const loadedTasks = await loadTaskData(date);
        setTasks(loadedTasks);
        setIsLoading(false);
    };

    const orderTasks = (orderType) => {
        let sortedTasks = [...tasks];
        if (orderType === "byPriority") {
            const priorityOrder = ["primary", "important", "routine"];
            sortedTasks = sortedTasks.sort((taskX, taskY) =>
                priorityOrder.indexOf(taskX.taskPriority) - priorityOrder.indexOf(taskY.taskPriority)
            );
        } else if (orderType === "byTime") {
            sortedTasks = sortedTasks.sort((taskX, taskY) => {
                const x = new Date(`${taskX.taskDate}T${taskX.taskTime}`);
                const y = new Date(`${taskY.taskDate}T${taskY.taskTime}`);
                return x - y;
            });
        } else if (orderType === "byEnabled") {
            sortedTasks = sortedTasks.sort((taskX, taskY) => {
                if (taskX.isEnabled !== taskY.isEnabled) {
                    return taskY.isEnabled - taskX.isEnabled;
                }
                const timeX = new Date(`${taskX.taskDate}T${taskX.taskTime}`);
                const timeY = new Date(`${taskY.taskDate}T${taskY.taskTime}`);
                return timeX - timeY;
            });
        }
        setTasks(sortedTasks);
    };

    const orderOnFocus = async () => {
        await orderTasks(orderType)
    }

    useEffect(() => {
        const updateTasks = async () => {
            const loadedTasks = await loadTaskData(selectedDate);
            setTasks(loadedTasks);
        };
        if (isFocused) {
            loadTasks(selectedDate);
            updateTasks();
            disableOldTasks();
            updateMarkedDates();
            if (date) {
                setSelectedDate(date);
                loadTasks(date);
            }
        }
    }, [isFocused]);

    useEffect(() => {
        orderOnFocus();
        disableOldTasks();
        orderTasks(orderType)
    }, [selectedDate])

    const emptyTaskList = require('../assets/images/empty-list.png');
    return (
        <View style={[{ flex: 1 }, { backgroundColor: theme.bgColor3.backgroundColor }]}>
            <NotificationListener
                onReceived={async () => {
                    setIsLoading(true);
                    await loadTasks(selectedDate);
                    await disableOldTasks();
                    setIsLoading(false);
                }}
            />
            <LoadingScreen visible={isLoading} isOverlay={true} />
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.altContainer}>
                    <Header />
                    <View style={styles.content}>
                        <View key={theme.theme}>
                            <Shadow
                                distance={8}
                                startColor="#00005515"
                                endColor="#00005501"
                                style={{ width: "100%" }}
                            >
                                <Calendar
                                    current={selectedDate}
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
                                        dotStyle: {
                                            marginTop: hp("-0.25"),
                                            borderRadius: wp("0.6"),
                                            width: wp("1.1"),
                                            aspectRatio: 1,
                                        },
                                    }}
                                    markingType={'multi-dot'}
                                    onDayPress={(day) => {
                                        setSelectedDate(day.dateString);
                                        loadTasks(day.dateString);
                                        updateMarkedDates();
                                    }}

                                    markedDates={{
                                        ...markedDates,
                                        [selectedDate]: {
                                            ...markedDates[selectedDate],
                                            selected: true,
                                            selectedColor: '#6255D3',
                                        },
                                    }}
                                />
                            </Shadow>
                        </View>

                        {/* Görev Listesi */}
                        <View style={styles.todayTasks}>
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: wp("4") }}>
                                <View style={{ display: "flex", flexDirection: "row", gap: wp("3"), alignItems: "center" }}>
                                    <Text style={[{ fontSize: wp("5"), paddingBottom: hp("0.2"), color: theme.primaryText.color }]}>
                                        Bugünün Görevleri
                                    </Text>
                                    <TouchableOpacity
                                        style={{ backgroundColor: theme.interactItem.backgroundColor, padding: wp(".75"), borderRadius: 5 }}
                                        hitSlop={{ top: 35, bottom: 35, left: 35, right: 35 }}
                                        onPress={async () => {
                                            setIsLoading(true);
                                            loadTasks(selectedDate);
                                            disableOldTasks();
                                            orderTasks(orderType)
                                            setIsLoading(false);
                                        }}>
                                        <MaterialIcons name="refresh" size={wp("5.5")} color="white" />
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    borderBottomWidth: 2,
                                    borderBottomColor: "#777777",
                                }}>
                                    <Picker
                                        style={[styles.orderDropdown, { color: theme.primaryText.color }]}
                                        selectedValue={orderType}
                                        dropdownIconColor={theme.primaryText.color}
                                        onValueChange={async (itemValue) => {
                                            setIsLoading(true);
                                            setOrderType(itemValue);
                                            await orderTasks(itemValue);
                                            setIsLoading(false);
                                        }}
                                    >
                                        <Picker.Item label="Zamanına Göre (Varsayılan)" value="byTime" />
                                        <Picker.Item label="Görev Önceliğine Göre" value="byPriority" />
                                        <Picker.Item label="Aktifliğe Göre" value="byEnabled" />
                                    </Picker>
                                </View>
                            </View>
                            {tasks.length > 0 ? (
                                tasks
                                    .map((task, index) => (
                                        <SoonMenuItem
                                            key={index}
                                            task={task}
                                            isEditable={true}
                                            isEnabled={task.isEnabled}
                                            taskDate={selectedDate}
                                            taskIndex={index}
                                            taskName={task.taskName}
                                            taskDescription={task.taskDescription}
                                            taskTime={task.taskTime}
                                            taskPriority={task.taskPriority}
                                        />
                                    ))
                            ) : (
                                <View style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, gap: hp("2") }}>
                                    <Image style={{ aspectRatio: 1, height: 300 }} source={emptyTaskList}></Image>
                                    <Text style={[{ fontSize: wp("4.5"), color: theme.secondaryText.color }]}>
                                        Bugün İçin Kayıtlı Görev Yok. Şimdi Yeni Bir Tane Oluştur
                                    </Text>
                                </View>
                            )}
                            <View style={{ marginTop: hp("5") }}>
                                <TouchableOpacity style={styles.createTask} onPress={() => {
                                    router.push({
                                        params: { date: selectedDate, taskObject: JSON.stringify("") },
                                        pathname: "tasks/create"
                                    });
                                }}>
                                    <FontAwesome5 name="plus" size={24} color="#fff" />
                                    <Text style={[{ fontSize: wp("6") }, { color: "#fff" }]}>Görev Oluştur</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View >
    );
};

const styles = StyleSheet.create({
    altContainer: {
        paddingHorizontal: wp('5%'),
        paddingTop: hp('5%'),
        paddingBottom: hp('10%'),
    },
    content: {
        gap: hp('5%'),
        display: "flex",
        paddingTop: hp('5%'),
    },
    todayTasks: {
        display: "flex",
        gap: hp("2"),
        flexDirection: "column",
        justifyContent: "center",
    },
    createTask: {
        backgroundColor: '#6255D3',
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 20,
        paddingVertical: hp("3.5"),
        borderRadius: 15,
        gap: wp("3"),
    },
    button: {
        fontSize: 24,
        textDecorationLine: 'underline',
        color: '#EB5757',
    },
    orderDropdown: {
        width: wp(40),
        fontSize: wp("3.5"),
    }
});

export default Tasks;