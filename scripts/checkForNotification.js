// scripts/checkForNotification.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export const startTaskChecker = () => {
    const sendImmediateNotification = async (task) => {
        const headers = {
            routine: "Vakit Geldi 📣",
            important: "Dikkat Dikkat ❗",
            primary: "Zaman kaybetmeden ilgilenin 🏳️",
        };

        await Notifications.scheduleNotificationAsync({
            content: {
                title: headers[task.taskPriority],
                body: `${task.taskName} Görevinin Vakti Geldi`,
                sound: true,
                data: { source: "lyncia" },
            },
            trigger: null,
        });
    };

    setInterval(async () => {
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = `${now.getHours()}`.padStart(2, '0') + ':' + `${now.getMinutes()}`.padStart(2, '0');

        try {
            const tasks = await AsyncStorage.getItem('tasks');
            const taskList = tasks ? JSON.parse(tasks) : {};

            if (!taskList[currentDate]) return;

            for (let i = 0; i < taskList[currentDate].length; i++) {
                const task = taskList[currentDate][i];
                const taskTimeFormatted = task.taskTime.split(":").map(t => t.padStart(2, '0')).join(":");

                if (task.isEnabled && taskTimeFormatted === currentTime) {
                    await sendImmediateNotification(task);
                    taskList[currentDate][i].isEnabled = false;
                }
            }

            await AsyncStorage.setItem('tasks', JSON.stringify(taskList));
        } catch (error) {
            console.error("Görev kontrol hatası:", error);
        }
    }, 3000);
};
