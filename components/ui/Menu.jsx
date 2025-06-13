import React,{ useContext } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, Dimensions } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import useAuth from '@/hooks/Auth';
import { ThemeContext } from '@/hooks/ThemeProvider';

const Menu = (props) => {

    const{ theme } = useContext(ThemeContext);

    const navigation = props.navigation;

    const { logout } = useAuth();

    const { height, width } = Dimensions.get('window');
    const size = height > width ? width: height;

    const styles = StyleSheet.create({
        title: {
            fontSize: size * 0.07,
            fontWeight: "bold",
            textAlign: "center",
            color: theme.menuText,
        },
        subtitle: {
            fontSize: size * 0.03,
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
            <View style = {{ flexDirection:'row', justifyContent: 'space-between', verticalAlign: 'center', alignItems: 'center'}}>
                {props.back && 
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        style = {{ paddingRight: 10 }}
                    >
                        <Ionicons name="arrow-back" size={size * 0.1} color={theme.menuText} />
                    </TouchableOpacity>}

                <View style = {styles.titlecontainer}>
                    <Text style={styles.title}>WAVE</Text>
                    <Text style={styles.subtitle}>By Automattrix</Text>
                </View>        
            </View>
            
            <View>
                {
                    props.invite &&
                        <TouchableOpacity 
                            onPress={() => props.setClicked(true)}
                            style = {{ paddingRight: 10 }}
                        >
                            props.clicked ?
                                <Ionicons nmae = "mail-unread-outline" size={size * 0.1} color = {theme.menuText} />
                            :
                                <Ionicons name="mail-outline" size={size * 0.1} color={theme.menuText} />
                        </TouchableOpacity>
                }
                <TouchableOpacity 
                    onPress={() => {
                        logout(navigation)
                        // navigation.navigate('login')
                    }}
                >
                    <Ionicons name="exit-outline" size={size * 0.1} color={theme.menuText} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Menu;