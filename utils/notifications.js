import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export const registerForPushNotifications = async () => {
    if (!Device.isDevice) {
      alert('Must use physical device for Push Notifications');
      return;
    }
  
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
  
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
  
    if (finalStatus !== 'granted') {
      alert('Permission not granted for notifications');
      return;
    }
  
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: '3bde5411-a19c-49e0-ae46-605164d31e8d', 
    });
  
    console.log('Expo Push Token:', tokenData.data);
  };

export async function showTemp(device, temp, time) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: '🌡Temperature Alert',
            body: `The temperature of ${device} is ${temp}°C\n Received at ${time}`,
        },
        trigger: null,
    });
}

export async function showBattery(device, battery, time) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: '🔋Battery Alert',
            body: `The battery of ${device} is ${battery}% \n Please charge your device\n Received at ${time}`,
        },
        trigger: null,
    });
}
