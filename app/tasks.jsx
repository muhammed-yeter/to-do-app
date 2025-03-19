
import {
    SafeAreaView,
    StyleSheet,
    View,
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
import React, { useState, useContext, useEffect } from 'react';
import themeContext from '../theme/themeContext';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../components/LoadingScreen';

const Tasks = () => {
    const theme = useContext(themeContext);
    const router = useRouter();
    const isFocused = useIsFocused();
    const currentDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD formatında alır
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [tasks, setTasks] = useState([]);
    const [markedDates, setMarkedDates] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const { date } = useLocalSearchParams();

    // Görevleri tarih bazlı yükle
    const loadTaskData = async (date) => {
        try {
            const tasks = await AsyncStorage.getItem('tasks'); // Görevler listesini al
            const tasksList = tasks ? JSON.parse(tasks) : {};  // JSON formatına çevir
            return tasksList[date] || []; // Tarihe özel görevleri döndür
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
                const dots = [];

                if (dayTasks.some(task => task.taskPriority === "routine")) {
                    dots.push({ color: "#77C260" }); // Yeşil
                }
                if (dayTasks.some(task => task.taskPriority === "important")) {
                    dots.push({ color: "#F0B179" }); // Turuncu
                }
                if (dayTasks.some(task => task.taskPriority === "primary")) {
                    dots.push({ color: "#C26061" }); // Kırmızı
                }
                if (dots.length > 0) {
                    newMarkedDates[date] = {
                        dots: dots.slice(0, 3), // Maksimum 3 nokta
                        customStyles: {
                            container: {
                                backgroundColor: selectedDate === date ? '#6255D3' : '#e0e0e0', // Mor veya gri arka plan
                                borderRadius: 10,
                            },
                            text: {
                                color: selectedDate === date ? '#fff' : theme.primaryText.color, // Beyaz veya varsayılan metin rengi
                                fontWeight: 'bold',
                            },
                        },
                    };
                }
            });

            setMarkedDates(newMarkedDates);
        } catch (e) {
            console.error("Takvim işaretleri güncellenirken hata oluştu:", e);
        }
    };


    const loadTasks = async (date) => {
        setIsLoading(true);
        const loadedTasks = await loadTaskData(date);
        setTasks(loadedTasks);
        setIsLoading(false);
    };

    useEffect(() => {
        const updateTasks = async () => {
            const loadedTasks = await loadTaskData(selectedDate);
            setTasks(loadedTasks);
        };

        if (isFocused) {
            loadTasks(selectedDate);
            updateTasks();
            updateMarkedDates();
            if (date) {
                setSelectedDate(date);
                loadTasks(date);
            }
        }
    }, [isFocused]);
    // Boş liste görseli
    const emptyTaskList = require('../assets/images/empty-list.png');
    return (
        <SafeAreaView style={[{ flex: 1 }, { backgroundColor: theme.bgColor3.backgroundColor }]}>
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
                                            borderRadius: wp("0.6"), // Make it a perfect circle
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
                            <Text style={[{ fontSize: wp("5.5") }, { color: theme.primaryText.color, textAlign: 'center' }]}>
                                Bugünün Görevleri
                            </Text>
                            {tasks.length > 0 ? (
                                tasks.map((task, index) => (
                                    <View key={index}>
                                        <SoonMenuItem
                                            isEditable={true}
                                            taskDate={selectedDate}
                                            taskIndex={index} // taskIndex ekleniyor
                                            taskName={task.taskName}
                                            taskDescription={task.taskDescription}
                                            taskTime={task.taskTime}
                                            taskPriority={task.taskPriority}
                                        />

                                    </View>
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
                                        params: { date: selectedDate },
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
        </SafeAreaView >
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
        color: '#FF4949',
    },
});

export default Tasks;
