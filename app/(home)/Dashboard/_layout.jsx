import {createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './Dashboard';
import Room from './Room';
import { useRoute } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export default function Dash() {
  const { params } = useRoute();
  console.log("Device ID:", params.deviceID);
  return (
            <Stack.Navigator initialRouteName='dash' screenOptions={{headerShown: false}}>
              <Stack.Screen name = 'dash' component={Dashboard} initialParams={{deviceID: params.deviceID}}/>
              <Stack.Screen name = 'room/[id]' component={Room} />
            </Stack.Navigator>
  );
}
