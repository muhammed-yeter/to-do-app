import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

const NotificationListener = ({ onReceived }) => {
    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(notification => {

            if (notification.request.content.data?.source === "lyncia") {
                onReceived(notification);
            }
        });
        return () => subscription.remove();
    }, [onReceived]);

    return null;
};

export default NotificationListener;