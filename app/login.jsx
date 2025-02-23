import React, { useState, useContext } from 'react';
import { Text, StyleSheet, View, TextInput, Pressable, Dimensions, TouchableOpacity } from 'react-native';
import { ThemeContext } from '@/hooks/ThemeProvider';
import ThemeButton from '@/components/ui/ThemeButton'; 

function Login({navigation}) {
    const { theme } = useContext(ThemeContext);
    // const router = useRouter();
    const { width, height } = Dimensions.get('window');
    const [ USN, setUSN ] = useState('');
    const [ password, setpass ] = useState('');
    const [msg, setmsg] = useState("");

    const styles = StyleSheet.create({
        mainContainer: {
            backgroundColor: theme.background,
            alignItems: 'center',
            width: '100%',
            height: '100%',
            flexGap: 10,
        },
        link: {
            color: "#0056b3"	,
            textDecorationLine: 'underline'
        },
        hr:{
            height: 1,
            width: width * 0.2,
            borderBottomWidth: 5,
            borderBottomColor:theme.text,
        },
        text: {
            color: theme.labelText,
            fontSize: 25,
            padding: 20,
            textAlign: 'center',
            textAlignVertical: 'center',
        },
        button: {
            margin: 20,
            padding: 10,
            borderRadius: 5,
            borderWidth: 1,
            color: theme.text,
            backgroundColor: theme.button.background ,
        },
        inputText: {
            color: theme.text,
            fontSize: 25,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: theme.button.background,
            textAlign: 'center',
            textAlignVertical: 'center',
            height: 40,
        },
        buttonText: {
            color: theme.button.color
        }
    })

    return (
        <View style={styles.mainContainer}>
            <View style = { { alignSelf: 'flex-end' } } >
                <ThemeButton />
            </View>
            <Text style={styles.text}>Enter the username:</Text>
            <TextInput 
                value={USN}
                onChangeText={(text) => setUSN(text)}
                style = {styles.inputText}
            />
            <Text style={styles.text}>Enter password:</Text>
            <TextInput 
                value={password}
                onChangeText={(text) => setpass(text)}
                style = {styles.inputText}
            />
            <Text style={styles.text}>{msg}</Text>text
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("home")}
             >
                <Text style = {styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <View>
                <View style= {styles.hr}></View>
                <Text style = {styles.text}>new user? <Pressable onFocus = {( ()=> { navigation.navigate('register') })} style={styles.link}><Text style = {styles.text}>Register here</Text></Pressable></Text>
            </View>
        </View>
    )
}

export default Login;