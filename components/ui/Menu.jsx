import React,{ useContext } from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import useAuth from '@/hooks/Auth';
import { ThemeContext } from '@/hooks/ThemeProvider';

const Menu = (props) => {

    const{ theme } = useContext(ThemeContext);

    const navigation = props.navigation;

    const { logout } = useAuth();

    const styles = StyleSheet.create({
        title: {
            fontSize: 36,
            fontWeight: "bold",
            textAlign: "center",
            color: theme.menuText,
        },
        subtitle: {
            fontSize: 16,
            color: theme.labelText,
            textAlign: "center",
        },
        container:{
            display: 'flex',
            flexDirection: "row",
            alignItems: 'center',
            verticalAlign: 'center',
            width: '100%',
            justifyContent: 'space-between',
            backgroundColor: theme.menuBackground
        },
        titlecontainer: {
            display: 'flex',
            flexDirection: "column",
            justifyContent: 'center',
            verticalAlign: 'center',
            alignItems: 'center',
        },
    })


    return (
        <View style={styles.container} >
            <View style = {{ flexDirection:'row' }}>
                {props.back && 
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        style = {{ paddingRight: 10 }}
                    >
                        <Ionicons name="arrow-back" size={45} color={theme.menuText} />
                    </TouchableOpacity>}

                <View style = {styles.titlecontainer}>
                    <Text style={styles.title}>WAVE</Text>
                    <Text style={styles.subtitle}>By Automattrix</Text>
                </View>        
            </View>
            <TouchableOpacity 
                onPress={() => {
                    logout(navigation)
                    // navigation.navigate('login')
                }}
            >
                <Ionicons name="exit-outline" size={45} color={theme.menuText} />
            </TouchableOpacity>
        </View>
    )
}

export default Menu;