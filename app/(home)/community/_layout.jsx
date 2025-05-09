import {createNativeStackNavigator } from '@react-navigation/native-stack';
import Community from './Community';
import CreateComm from './CreateComm';
import CommPage from './CommPage';
import Create from './Create';
import Info from './Info';

const Stack = createNativeStackNavigator();

export default function Commune() {
  
  return (
            <Stack.Navigator initialRouteName='community' screenOptions={{headerShown: false}}>
              <Stack.Screen name = 'community' component={Community} />
              <Stack.Screen name = 'community/[page]' component={CommPage} />
              <Stack.Screen name = 'create' component={ CreateComm } />
              <Stack.Screen name = 'create/[page]' component={ Create } />
              <Stack.Screen name = 'community/[page]/info' component={ Info } />
            </Stack.Navigator>
  );
}
