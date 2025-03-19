import AsyncStorage from '@react-native-async-storage/async-storage';
// const loadData = async () => {
//     try {
//         const value = await AsyncStorage.getItem(İTEM_ADI);
//         if (value !== null) {
//             //ne yapmak istersen buraya
//             console.log("status : ", value);
//         }
//     } catch (e) {
//         console.error(e);
//     }
// };
// loadData();

const saveData = async (itemName, value) => {
    try {
        await AsyncStorage.setItem(itemName, value.toString());
    } catch (e) {
        console.error(e);
    }
};


const saveTaskData = async (date, task) => {
    try {
        const tasks = await AsyncStorage.getItem('tasks'); // Mevcut tüm görevleri al
        const tasksList = tasks ? JSON.parse(tasks) : {};  // JSON formatına çevir veya boş obje
        if (!tasksList[date]) tasksList[date] = [];                   // Eğer seçilen tarihte görev yoksa boş liste oluştur
        tasksList[date].push(task);                                // Görevi seçilen tarihe ekle
        await AsyncStorage.setItem('tasks', JSON.stringify(tasksList)); // Güncellenen görevleri kaydet
    } catch (e) {
        console.error("Görev kaydedilirken hata oluştu:", e);
    }
};

const loadTaskData = async (date) => {
    try {
        const tasks = await AsyncStorage.getItem('tasks'); // Görevler listesini getir
        const tasksList = tasks ? JSON.parse(tasks) : {};  // JSON formatına çevir
        return tasksList[date] || [];                                 // Eğer o gün için görev yoksa boş liste döndür
    } catch (e) {
        console.error("Görev yüklenirken hata oluştu:", e);
        return [];
    }
};

export default saveData;
