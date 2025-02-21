import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './Dashboard';
import Settings from './Settings';
import Ionicons from '@expo/vector-icons/Ionicons';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

function Home() {
    return (
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
            <Tab.Screen name= "dashboard" component={Dashboard} />
            <Tab.Screen name= "settings" component={Settings} />
            <Tab.Screen name = "profile" component={Profile} />
        </Tab.Navigator>
    );
};

export default Home;