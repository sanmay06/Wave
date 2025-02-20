import {createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from '../hooks/ThemeProvider';
import Login from './login';
import Dashboard from './Dashboard';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  
  return (
      <ThemeProvider>
        {/* <NavigationContainer> */}
            <Stack.Navigator initialRouteName='Login'>
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
              <Stack.Screen name='Home' component={ Dashboard } />
            </Stack.Navigator>
        {/* </NavigationContainer> */}
        </ThemeProvider>
  );
}
