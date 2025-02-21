import React, { useState, useContext } from 'react';
import { Text, StyleSheet, View, TextInput, Pressable, Button, TouchableNativeFeedbackComponent, TouchableOpacity } from 'react-native';
import { ThemeContext } from '@/hooks/ThemeProvider';
import ThemeButton from '@/components/ui/ThemeButton'; 

function Login({navigation}) {
    const { theme } = useContext(ThemeContext);
    // const router = useRouter();
    const [ USN, setUSN ] = useState('');
    const [ password, setpass ] = useState('');

    const styles = StyleSheet.create({
        mainContainer: {
            backgroundColor: theme.background,
            alignItems: 'center',
            width: '100%',
            height: '100%',
            flexGap: 10,
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
                onChangeText={() => setUSN()}
                style = {styles.inputText}
            />
            <Text style={styles.text}>Enter password:</Text>
            <TextInput 
                value={password}
                onChangeText={() => setpass()}
                style = {styles.inputText}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("home")}
             >
                <Text style = {styles.buttonText}>Submit</Text>
             </TouchableOpacity>
        </View>
    )
}

export default Login;