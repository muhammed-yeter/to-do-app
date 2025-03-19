import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import SoonMenuItem from '../components/SoonMenuItem';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import React, { useState, useContext, useEffect } from 'react';
import themeContext from '../theme/themeContext';

import { useIsFocused } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../components/LoadingScreen';
import { useRouter } from 'expo-router';

const HomePage = () => {

    const isFocused = useIsFocused();
    const theme = useContext(themeContext);
    const currentDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD formatında alır

    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [welcomeText, setWelcomeText] = useState("Merhaba");
    const [welcomeDescription, setWelcomeDescription] = useState("Bugün için Hiç Görev Yok");
    const [tasks, setTasks] = useState([]);

    const getTaskData = async (date) => {
        const tasks = await AsyncStorage.getItem('tasks');
        const tasksList = tasks ? JSON.parse(tasks) : {};
        return tasksList[date] || [];
    };

    function setTexts(value) {
        let taskCounter = value;
        let currentHour = new Date().getHours();
        if (currentHour >= 5 && currentHour <= 12) {
            setWelcomeText("Günaydın")
        }
        else if (currentHour >= 13 && currentHour <= 17) {
            setWelcomeText("İyi Günler")
        }
        else if (currentHour >= 18 && currentHour <= 21) {
            setWelcomeText("İyi Akşamlar")
        }
        else if (currentHour <= 4 || currentHour >= 22) {
            setWelcomeText("İyi Geceler")
        }

        if (taskCounter >= 1 && taskCounter < 5) {
            setWelcomeDescription(["Bugün için ", taskCounter, " Adet Göreviniz Var"])
        }
        else if (taskCounter >= 5) {
            setWelcomeDescription(["Bugün için ", taskCounter, " Adet Göreviniz Var. ", "Yoğun bir gün, değil mi?."])
        }


    }

    useEffect(() => {
        const loadTasks = async () => {
            setIsLoading(true);
            const loadedTasks = await getTaskData(selectedDate);
            setTasks(loadedTasks);
            setTexts(loadedTasks.length);
            setIsLoading(false);
        };

        if (isFocused) {
            loadTasks();
        }
    }, [isFocused, selectedDate]);

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const emptyTaskList = require('../assets/images/empty-list.png');
    return (
        <SafeAreaView style={{ backgroundColor: theme.bgColor3.backgroundColor }}>
            <LoadingScreen visible={isLoading} isOverlay={true} />
            <ScrollView style={{ width: "100%", height: "100%", }}>
                <View style={styles.altContainer}>
                    <Header />
                    <View style={styles.content}>
                        <View style={{ gap: hp("1"), paddingBottom: hp("3"), marginRight: wp("10"), borderBottomWidth: 2, borderBottomColor: "#70707050" }}>
                            <Text style={{ fontSize: wp("5"), color: theme.primaryText.color }}>{welcomeText}</Text>
                            <Text style={{ fontSize: wp("4"), color: theme.secondaryText.color }}>{welcomeDescription}</Text>
                        </View>

                        {/* Görev Listesi */}
                        <View style={styles.contentBottom}>
                            <Text style={[styles.soonHeader, { color: theme.primaryText.color }]}>
                                Yakınlarda
                            </Text>
                            <View style={styles.taskList}>
                                {tasks.length > 0 ? (
                                    tasks.map((task, index) => (
                                        <SoonMenuItem
                                            key={index}
                                            isEditable={false}
                                            taskDate={selectedDate}
                                            taskIndex={index}
                                            taskName={task.taskName}
                                            taskDescription={task.taskDescription}
                                            taskTime={task.taskTime}
                                            taskPriority={task.taskPriority}
                                        />
                                    ))
                                ) : (
                                    <View style={styles.emptyTasksContainer}>
                                        <Image style={styles.emptyImage} source={emptyTaskList} />
                                        <Text style={[styles.soonHeader, { color: theme.secondaryText.color }]}>
                                            Yakınlarda Hiç Görev Yok. Şimdi Yeni Bir Tane
                                            <TouchableOpacity style={{ paddingLeft: wp("1") }} onPress={() => {
                                                // router.push({
                                                //     params: { date: selectedDate },
                                                //     pathname: "tasks/create"
                                                // });
                                            }}
                                                hitSlop={{ top: 25, bottom: 25, left: 25, right: 25 }}>
                                                <Text style={styles.button}>Oluştur</Text>
                                            </TouchableOpacity>
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// Stil Ayarları
const styles = StyleSheet.create({
    altContainer: {
        paddingHorizontal: wp('5%'),
        paddingTop: hp('5%'),
    },
    content: {
        gap: hp('7%'),
        paddingTop: hp('5%'),
        height: hp('75%'),
        width: wp('90%'),
    },
    contentBottom: {
        display: 'flex',
        gap: hp('1.5'),
        flex: 1,
        justifyContent: 'center',
    },
    taskList: {
        display: 'flex',
        gap: hp('1.5'),
        flex: 1,
    },
    emptyTasksContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        gap: hp("2"),
    },
    emptyImage: {
        aspectRatio: 1,
        height: 300,
    },
    soonHeader: {
        fontSize: wp("4.5"),
    },
    button: {
        fontSize: wp("4.5"),
        textDecorationLine: 'underline',
        color: '#FF4949',
    },
});

export default HomePage;