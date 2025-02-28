import React,{ useContext } from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from "react-native"
import ThemeButton from './ThemeButton'
import Ionicons from '@expo/vector-icons/Ionicons';
import useAuth from '@/hooks/Auth';
import { ThemeContext } from '@/hooks/ThemeProvider';

const Menu = ({navigation}) => {

    const{ theme } = useContext(ThemeContext);

    const { logout } = useAuth();

    const styles = StyleSheet.create({
        container:{
            display: 'flex',
            flexDirection: "column",
        },
    })


    return (
        <View style={styles.container} >
            <ThemeButton />            
            <TouchableOpacity 
                onPress={() => {
                    logout(navigation)
                    // navigation.navigate('login')
                }}
            >
                <Ionicons name="exit-outline" size={24} color="black" />
            </TouchableOpacity>
        </View>
    )
}

export default Menu;