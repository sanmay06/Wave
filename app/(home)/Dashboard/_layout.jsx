import {createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from '@/hooks/ThemeProvider';
import Dashboard from './Dashboard';
import Room from './Room';

const Stack = createNativeStackNavigator();

export default function Dash() {
  
  return (
      <ThemeProvider>
        {/* <NavigationContainer> */}
            <Stack.Navigator initialRouteName='dash' screenOptions={{headerShown: false}}>
              <Stack.Screen name = 'dash' component={Dashboard} />
              <Stack.Screen name = 'room/[id]' component={Room} />
              {/* <Stack.Screen name='Home' component={ Dashboard } /> */}
            </Stack.Navigator>
        {/* </NavigationContainer> */}
        </ThemeProvider>
  );
}
