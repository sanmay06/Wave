import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from './Settings';
import Ionicons from '@expo/vector-icons/Ionicons';
import Profile from './Profile';
import Dash from './Dashboard/_layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { ThemeContext } from '@/hooks/ThemeProvider';
import Commune from './community/_layout';
import { useRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

function Home() {

    const { theme } = useContext(ThemeContext);
    const { params } = useRoute();

    return (
        <SafeAreaView style={{ flex: 1}}>
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
                        if(route.name === "community")
                            icon = focused ? 'people' : 'people-outline';

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
                <Tab.Screen name= "dashboard" component={Dash} initialParams={{deviceID: params.deviceID}}/>
                <Tab.Screen name= "analysis" component={Settings} initialParams={{deviceID: params.deviceID}}/>
                <Tab.Screen name = "profile" component={Profile} initialParams={{deviceID: params.deviceID}}/>
                <Tab.Screen name = 'community' component={Commune} initialParams={{deviceID: params.deviceID}}/>
            </Tab.Navigator>
        </SafeAreaView>
        
    );
};

export default Home;