import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from './Settings';
import Ionicons from '@expo/vector-icons/Ionicons';
import Profile from './Profile';
import Dash from './Dashboard/_layout';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { ThemeContext } from '@/hooks/ThemeProvider';

const Tab = createBottomTabNavigator();

function Home() {

    const { theme } = useContext(ThemeContext);

    return (
        <SafeAreaProvider>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size}) => {
                        let icon;

                        if(route.name === "dashboard")
                            icon = focused ? 'grid' : 'grid-outline';
                        if(route.name === "analysis")
                            icon = focused ? 'analytics' : 'analytics-outline';
                        if(route.name === "profile")
                            icon = focused ? 'person-circle' : 'person-circle-outline';

                        return <Ionicons name={icon} size={size} color={color} />
                    },
                    tabBarActiveTintColor: '#0073e6',
                    tabBarInactiveTintColor: '#808080', 
                    tabBarStyle: {
                        backgroundColor: theme.tabBackground,
                        color: theme.tabText,
                    },
                    headerShown: false,
                })}
            >
                <Tab.Screen name= "dashboard" component={Dash} />
                <Tab.Screen name= "analysis" component={Settings} />
                <Tab.Screen name = "profile" component={Profile} />
            </Tab.Navigator>
        </SafeAreaProvider>
        
    );
};

export default Home;