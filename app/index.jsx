import {
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
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import NotificationListener from '../scripts/notificationListener';

const HomePage = () => {

    const isFocused = useIsFocused();
    const theme = useContext(themeContext);
    const currentDate = new Date().toLocaleDateString('en-CA'); // YYYY-AA-GG

    const [selectedDate] = useState(currentDate);
    const [welcomeText, setWelcomeText] = useState("Merhaba");
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [orderType, setOrderType] = useState("byTime");

    const getTaskData = async (date) => {
        const tasks = await AsyncStorage.getItem('tasks');
        const tasksList = tasks ? JSON.parse(tasks) : {};
        return tasksList[date] || [];
    };

    function setTexts(value) {
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
    }

    const filterSoonTasks = async () => {
        const now = new Date(); // Şu anki tarih ve saat
        const loadedTasks = await getTaskData(selectedDate); // Görevleri yükle

        // Geçmiş görevleri filtrele
        const filteredTasks = loadedTasks.filter(task => {
            const taskDateTime = new Date(`${task.taskDate}T${task.taskTime}`);
            return taskDateTime > now; // Geçmiş görevleri hariç tut
        });

        setTasks(filteredTasks); // Filtrelenmiş görevleri state'e aktar
    };
    const orderTasks = (orderType) => {
        let sortedTasks = [...tasks];
        if (orderType === "byPriority") {
            const priorityOrder = ["primary", "important", "routine"];
            sortedTasks = sortedTasks.sort((taskX, taskY) => {
                return priorityOrder.indexOf(taskX.taskPriority) - priorityOrder.indexOf(taskY.taskPriority);
            });
        } else if (orderType === "byTime") {
            sortedTasks = sortedTasks.sort((taskX, taskY) => {
                const x = new Date(`2025-03-20T${taskX.taskTime}:00`);
                const y = new Date(`2025-03-20T${taskY.taskTime}:00`);
                return x - y;
            });
        }
        setTasks([...sortedTasks]);
    };

    useEffect(() => {
        setTexts(tasks.length)
        setIsLoading(true);
        filterSoonTasks();
        // Hoşgeldiniz metinlerini güncelle
        setIsLoading(false);
    }, [isFocused, selectedDate]);

    const router = useRouter();
    const emptyTaskList = require('../assets/images/empty-list.png');
    return (
        <View style={{ backgroundColor: theme.bgColor3.backgroundColor }}>
             <NotificationListener
                onReceived={async () => {
                    setIsLoading(true);
                    await filterSoonTasks(); // Filtreleme işlemini tetikleyin
                    setIsLoading(false);
                }}
            />
            <LoadingScreen visible={isLoading} isOverlay={true} />
            <ScrollView style={{ width: "100%", height: "100%", }}>
                <View style={styles.altContainer}>
                    <Header />
                    <View style={styles.content}>
                        <View style={{ gap: hp("1"), paddingBottom: hp("2"), marginRight: wp("0"), borderBottomWidth: 2, borderBottomColor: "#70707050" }}>
                            <Text style={{ fontSize: wp("5"), color: theme.primaryText.color }}>{welcomeText}</Text>
                        </View>

                        {/* Görev Listesi */}
                        <View style={styles.contentBottom}>
                            <View style={{ display: "flex", flexDirection: "row", gap: wp("3"), marginBottom: hp(5), alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ display: "flex", flexDirection: "row", gap: wp("3"), alignItems: "center" }}>
                                    <Text style={[styles.soonHeader, { color: theme.primaryText.color }]}>
                                        Yakınlarda
                                    </Text>
                                    <TouchableOpacity
                                        style={{ backgroundColor: theme.interactItem.backgroundColor, padding: wp(".75"), borderRadius: 5 }}
                                        hitSlop={{ top: 35, bottom: 35, left: 35, right: 35 }}
                                        onPress={async () => {
                                            setIsLoading(true);
                                            await filterSoonTasks(); // Filtreleme işlemini tetikleyin
                                            setIsLoading(false);
                                        }}
                                    >
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
                                        onValueChange={(itemValue) => {
                                            setOrderType(itemValue); // Seçimi güncelle
                                            orderTasks(itemValue); // Görevleri sırala
                                        }}
                                    >
                                        <Picker.Item label="Zamanına Göre (Varsayılan)" value="byTime" />
                                        <Picker.Item label="Görev Önceliğine Göre" value="byPriority" />
                                    </Picker>
                                </View>
                            </View>
                            <View style={styles.taskList}>
                                {tasks.length > 0 ? (
                                    tasks
                                        .filter(task => {
                                            const now = new Date(); // Şu anki tarih ve saat
                                            const taskDateTime = new Date(`${task.taskDate}T${task.taskTime}`);
                                            return taskDateTime > now; // Geçmiş görevleri filtrele
                                        })
                                        .sort((taskX, taskY) => {
                                            if (orderType === "byPriority") {
                                                // Öncelik sırasına göre sıralama
                                                const priorityOrder = ["primary", "important", "routine"];
                                                return (
                                                    priorityOrder.indexOf(taskX.taskPriority) -
                                                    priorityOrder.indexOf(taskY.taskPriority)
                                                );
                                            } else if (orderType === "byTime") {
                                                // Zaman sırasına göre sıralama
                                                const x = new Date(`${taskX.taskDate}T${taskX.taskTime}`);
                                                const y = new Date(`${taskY.taskDate}T${taskY.taskTime}`);
                                                return x - y;
                                            }
                                        })
                                        .map((task, index) => (
                                            <SoonMenuItem
                                                key={index}
                                                isEditable={false}
                                                isEnabled={true}
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
                                                router.push({
                                                    params: { date: selectedDate },
                                                    pathname: "tasks/create"
                                                });
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
        </View >
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
        fontSize: wp("5"),
    },
    button: {
        fontSize: wp("4.5"),
        textDecorationLine: 'underline',
        color: '#EB5757',
    },
    orderDropdown: {
        width: wp(40),
        fontSize: wp("3.5"),
    }
});

export default HomePage;

