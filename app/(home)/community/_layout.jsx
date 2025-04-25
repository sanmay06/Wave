import {createNativeStackNavigator } from '@react-navigation/native-stack';
import Community from './Community';
import CreateComm from './CreateComm';
import CommPage from './CommPage';

const Stack = createNativeStackNavigator();

export default function Commune() {
  
  return (
            <Stack.Navigator initialRouteName='community' screenOptions={{headerShown: false}}>
              <Stack.Screen name = 'community' component={Community} />
              <Stack.Screen name = 'community/[id]' component={CommPage} />
              <Stack.Screen name='create' component={ CreateComm } />
            </Stack.Navigator>
  );
}
