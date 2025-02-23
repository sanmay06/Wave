import {createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from '../hooks/ThemeProvider';
import Login from './login';
import Home from './(home)/_layout';
import Register from './register';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  
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
