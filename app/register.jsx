import React, { useState, useContext } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, TextInput, Pressable } from "react-native";
import { ThemeContext } from "@/hooks/ThemeProvider";
import ThemeButton from "@/components/ui/ThemeButton";

function Register({navigation}) {

    const { theme } = useContext(ThemeContext);

    const { width, height } = Dimensions.get('window');

    const [email, setemail] = useState("");
    const [username, setusername] = new useState("");
    const [password, setpassword] = useState("");
    const [conpass, setconpass] = useState("");

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
            textDecorationLine: 'underline',
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
            <Text style={styles.text}>Enter Email-Address:</Text>
            <TextInput 
                value={email}
                onChangeText={() => setemail()}
                style = {styles.inputText}
            />
            <Text style={styles.text}>Enter the username:</Text>
            <TextInput 
                value={username}
                onChangeText={() => setusername()}
                style = {styles.inputText}
            />
            <Text style={styles.text}>Enter password:</Text>
            <TextInput 
                value={password}
                onChangeText={() => setpassword()}
                style = {styles.inputText}
            />
            <Text style={styles.text}>Enter password again:</Text>
            <TextInput 
                value={conpass}
                onChangeText={() => setconpass()}
                style = {styles.inputText}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("home")}
             >
                <Text style = {styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <View>
                <View style= {styles.hr}></View>
                <Text style = {styles.text}>existing user? <Pressable onFocus = {( ()=> { navigation.navigate('login') })} style={styles.link}>Login here</Pressable></Text>
            </View>
        </View>
    )

}

export default Register;