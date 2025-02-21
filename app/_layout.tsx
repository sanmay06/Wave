import {createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from '../hooks/ThemeProvider';
import Login from './login';
import Home from './(home)/_layout';
import Register from './register';
import Room from './(home)/Room';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  
  return (
      <ThemeProvider>
        {/* <NavigationContainer> */}
            <Stack.Navigator initialRouteName='login' screenOptions={{headerShown: false}}>
              <Stack.Screen name = "login" component={Login} />
              <Stack.Screen name = "home" component={Home} />
              <Stack.Screen name = "register" component={Register} />
              <Stack.Screen name = 'room/[id]' component={Room} />
              {/* <Stack.Screen name='Home' component={ Dashboard } /> */}
            </Stack.Navigator>
        {/* </NavigationContainer> */}
        </ThemeProvider>
  );
}
