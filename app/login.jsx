import React, { useState, useContext, useEffect } from 'react';
import { Text, StyleSheet, View, TextInput, Pressable, Dimensions, TouchableOpacity } from 'react-native';
import { ThemeContext } from '@/hooks/ThemeProvider';
import ThemeButton from '@/components/ui/ThemeButton'; 
import { auth } from '@/firebaseConfig';
import useAuth from '@/hooks/Auth';

function Login({navigation}) {

    const { error, login, logged } = useAuth();

    useEffect(() => {
        if(logged)
            navigation.navigate("home");
      console.log(logged);
    }, [logged])

    const { theme } = useContext(ThemeContext);
    // const router = useRouter();
    const { width, height } = Dimensions.get('window');
    const [ USN, setUSN ] = useState('');
    const [ password, setpass ] = useState('');
    const [ msg, setmsg ] = useState("");
    const [passvis, setpassvis] = useState(true);

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
            height: 60,
            width: 250,
        },
        buttonText: {
            color: theme.button.color
        }
    })

    useEffect(() => {
        
    }, [])

    return (
        <View style={styles.mainContainer}>
            <View style = { { alignSelf: 'flex-end' } } >
                <ThemeButton />
            </View>
            <Text style={styles.text}>Enter your E-mail:</Text>
            <TextInput 
                value={USN}
                onChangeText={(text) => setUSN(text)}
                style = {styles.inputText}
            />
            <Text style={styles.text}>Enter password:</Text>
            <TextInput 
                value={password}
                secureTextEntry={passvis}
                onChangeText={(text) => setpass(text)}
                style = {styles.inputText}
            />
            <TouchableOpacity
                onPress={ () => setpassvis(!passvis) }
            >
                <Text style={styles.text}>{passvis ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
            <Text style={styles.text}>{msg}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    login(USN, password);
                    setmsg(error);
                    }
                }
            >
                <Text style = {styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <View>
                <View style= {styles.hr}></View>
                <Text style = {styles.text}>new user? <Pressable onFocus = {( () => { navigation.navigate('register') })} style={styles.link}><Text style = {styles.text}>Register here</Text></Pressable></Text>
            </View>
        </View>
    )
}

export default Login;