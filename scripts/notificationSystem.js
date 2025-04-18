let n_ID_List = []; 

export const addNotification = (id) => {
    n_ID_List.push(id); 
};

export const deleteAllNotifications = () => {
    n_ID_List.forEach((id) => clearTimeout(id)); 
    n_ID_List = []; 
};