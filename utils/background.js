import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { showTemp, showBattery } from './notifications';
import { database } from '@/firebaseConfig';
import { ref, onValue, query, orderByKey, limitToLast, get } from 'firebase/database';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TASK_NAME = 'background-fetch';

async function fecthData(deviceId) {
    const getLatest = async (refPath) => {
        const refQuery = query(ref(database, refPath), orderByKey(), limitToLast(1));
        const snapshot = await get(refQuery);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const latestKey = Object.keys(data)[0];
          const latestValue = data[latestKey];
          if (typeof latestValue === 'object') {
            const valueKey = Object.keys(latestValue)[0];
            return String(latestValue[valueKey]);
          } else {
            return String(latestValue);
          }
        }
        return null;
    };

    return {
        pitemp: await getLatest(`/${deviceId}/pitemp`),
        temp: await getLatest(`/${deviceId}/temp`),
        btry: await getLatest(`/${deviceId}/btry`),
    }

}

TaskManager.defineTask(TASK_NAME, async () => {
    try {
        const deviceId = await AsyncStorage.getItem('deviceId');
        // const { user } = useAuth();
        // const deviceId = user.photoURL;
        const maxTemp = 20;
        const maxBattery = 90;
        const { pitemp, temp, btry } = await fecthData(deviceId);
        await showTemp('test', temp);
        if (temp > maxTemp) {
            await showTemp('Room Temperature', temp);
        }
    
        if (btry < maxBattery) {
            await showBattery('Rasbery PI Battery', btry);
        }
    
        if(pitemp > 90) {
            await showTemp('PI Temperature', pitemp);
        }
        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
        console.error('Background fetch error:', error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

export async function registerBackgroundFetchAsync() {
    
    if(Platform.OS === 'web') {
        return;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    if (!isRegistered) {
        await BackgroundFetch.registerTaskAsync(TASK_NAME, {
        minimumInterval: 15 * 60,   //change 15 to how freuqent minutes you want to check
        stopOnTerminate: false,
        startOnBoot: true,
        });
    }
}
