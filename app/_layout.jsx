import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from '../hooks/ThemeProvider';
import { useEffect } from 'react';
import { registerForPushNotifications } from '@/utils/notifications';
import { registerBackgroundFetchAsync } from '@/utils/background';
import Login from './login';
import Home from './(home)/_layout';
import Register from './register';
import useAuth from '@/hooks/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });  

const Stack = createNativeStackNavigator();

export default function RootLayout() {

  const { user } = useAuth();

  useEffect(() => {
    // registerForPushNotifications();
    // registerBackgroundFetchAsync();
  }, []);
  
  useEffect(() => {
    if (user?.photoURL) {
      AsyncStorage.setItem('deviceId', user.photoURL);
    }
  }, [user]);

  return (
      <ThemeProvider>
        {/* <NavigationContainer> */}
            <Stack.Navigator initialRouteName='login' screenOptions={{headerShown: false}}>
              <Stack.Screen name = "login" component={Login} />
              <Stack.Screen name = "home" component={Home} />
              <Stack.Screen name = "register" component={Register} />
            </Stack.Navigator>
        {/* </NavigationContainer> */}
        </ThemeProvider>
  );
}
