import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from './Settings';
import Ionicons from '@expo/vector-icons/Ionicons';
import Profile from './Profile';
import Dash from './Dashboard/_layout';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

function Home() {
    return (
        <SafeAreaProvider>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size}) => {
                        let icon;

                        if(route.name === "dashboard")
                            icon = focused ? 'grid' : 'grid-outline';
                        if(route.name === "settings")
                            icon = focused ? 'settings' : 'settings-outline';
                        if(route.name === "profile")
                            icon = focused ? 'person-circle' : 'person-circle-outline';

                        return <Ionicons name={icon} size={size} color={color} />
                    },
                    tabBarActiveTintColor: '#0073e6',
                    tabBarInactiveTintColor: '#808080', 
                })}  
            >
                <Tab.Screen name= "dashboard" component={Dash} />
                <Tab.Screen name= "settings" component={Settings} />
                <Tab.Screen name = "profile" component={Profile} />
            </Tab.Navigator>
        </SafeAreaProvider>
        
    );
};

export default Home;