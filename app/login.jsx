import React, { useState, useContext, useEffect } from 'react';
import { Text, StyleSheet, View, TextInput, Pressable, Dimensions, TouchableOpacity } from 'react-native';
import { ThemeContext } from '@/hooks/ThemeProvider';
import useAuth from '@/hooks/Auth';
import ForgotPasswordModal from '@/components/ui/ForgotPass';
import RadialBackground from '@/components/ui/Background';

function Login({navigation}) {

    const { error, login, logged, user } = useAuth();

    useEffect(() => {
        const checkLogin = async () => {
            const logg = await logged(navigation);
            if(logg.check) {
                // const devId = logg.deviceID;
                // console.log(logg);
                // console.log("Logged in with device ID: ", logg.deviceID);
                navigation.navigate("home", { deviceID: logg.deviceID });
            }
        }
        checkLogin();
    }, [logged])

    const { theme } = useContext(ThemeContext);
    // const router = useRouter();
    const { width, height } = Dimensions.get('window');
    const [ USN, setUSN ] = useState('');
    const [ password, setpass ] = useState('');
    const [ msg, setmsg ] = useState("");
    const [passvis, setpassvis] = useState(true);
    const [ forgotPass, setForgotPass ] = useState(false);

    const styles = StyleSheet.create({
        mainContainer: {
            backgroundColor: theme.background,
            alignItems: 'center',
            flex: 1,
            width: '100%',
            height: '100%',
            flexGap: 10,
        },
        link: {
            color: "#4285F4"	,
            textDecorationLine: 'underline'
        },
        hr:{
            height: 1,
            width: width * 0.75,
            borderBottomWidth: 5,
            borderBottomColor:theme.text,
        },
        text: {
            color: theme.labelText,
            fontSize: 20,
            padding: 20,
            textAlign: 'center',
            textAlignVertical: 'center',
        },
        login:{
            color: theme.labelText,
            fontSize: 15,
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
            fontSize: 15,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: theme.button.background,
            textAlign: 'center',
            textAlignVertical: 'center',
            height: 40,
            width: 250,
        },
        buttonText: {
            color: theme.button.color
        }
    })

    return (
        <View style={styles.mainContainer}>
            <RadialBackground />
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
                style = {styles.button}
                onPress={ () => setpassvis(!passvis) }
            >
                <Text style={styles.buttonText}>{passvis ? "Show" : "Hide"}</Text>
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
            <ForgotPasswordModal
                visible={forgotPass}
                onClose={() => setForgotPass(false)}
            />
            <TouchableOpacity 
                style= {styles.link}
                onPress={() => setForgotPass(true)}
            >
                <Text style = {styles.buttonText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            <View style = {{alignItems:"center"}}>
                <View style= {styles.hr}></View>
                <Text style = {styles.login}>new user? </Text><Pressable onPress={() => navigation.navigate('register')} style={styles.link}><Text style = {styles.login}>Register here</Text></Pressable>
            </View>
        </View>
    )
}

export default Login;