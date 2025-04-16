let n_ID_List = []; // Tüm timeout ID'leri burada saklanır

export const addNotification = (id) => {
    n_ID_List.push(id); // Timeout ID'sini kaydet
};

export const deleteAllNotifications = () => {
    n_ID_List.forEach((id) => clearTimeout(id)); // Tüm timeout işlemlerini iptal et
    n_ID_List = []; // Listeyi temizle
};