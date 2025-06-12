import React, { useState, useContext, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, TextInput, Pressable, Alert } from "react-native";
import { ThemeContext } from "@/hooks/ThemeProvider";
import useAuth from "@/hooks/Auth";
import { ScrollView } from "react-native-gesture-handler";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import RadialBackground from "@/components/ui/Background";

function Register({ navigation }) {
    const { register } = useAuth();
    const { theme } = useContext(ThemeContext);
    const { width } = Dimensions.get('window');

    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");
    const [conpass, setconpass] = useState("");
    const [msg, setmsg] = useState("");
    const [passvis, setpassvis] = useState(true);
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [ latitude, setLatitude ] = useState('');
    const [ longitude, setLongitude ] = useState('');

    const styles = StyleSheet.create({
        mainContainer: {
            backgroundColor: theme.background,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            flex: 1,
        },
        link: {
            color: "#0056b3",
            textDecorationLine: 'underline',
        },
        addressTest: {
            color: theme.text,
            fontSize: 15,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: theme.button.background,
            textAlignVertical: 'top',
            textAlign: 'center',
            height: 125,
            width: 350,
            padding: 10,
        },
        hr: {
            height: 1,
            width: width * 0.5,
            borderBottomWidth: 2,
            borderBottomColor: theme.text,
            marginVertical: 20,
        },
        text: {
            color: theme.labelText,
            fontSize: 20,
            textAlign: 'center',
            marginBottom: 10,
        },
        button: {
            margin: 10,
            padding: 10,
            borderRadius: 5,
            borderWidth: 1,
            backgroundColor: theme.button.background,
            alignItems: 'center',
            width: 250,
        },
        inputText: {
            color: theme.text,
            fontSize: 18,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: theme.button.background,
            textAlign: 'center',
            height: 45,
            width: 250,
            paddingHorizontal: 10,
            marginBottom: 10,
        },
        buttonText: {
            color: theme.button.color,
            fontSize: 18,
        },
        googleButton: {
            padding: 15,
            alignItems: 'center',
        }
    });

    useEffect(() => {
        if (conpass && conpass !== password) setmsg("Both passwords should match");
        else setmsg("");
    }, [conpass, password]);

    const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission to access location was denied");
                return;
            }
    
            let location = await Location.getCurrentPositionAsync({});
            setLatitude(location.coords.latitude.toString())
            setLongitude(location.coords.longitude.toString())
        }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}
            >
                <View style={styles.mainContainer}>
                    <Text style={styles.text}>Enter your Username</Text>
                    <TextInput 
                        style={styles.inputText}
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.text}>Enter your E-Mail</Text>
                    <TextInput 
                        style={styles.inputText}
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={styles.text}>Enter Device Id</Text>
                    <TextInput 
                        style={styles.inputText}
                        value={deviceId}
                        onChangeText={setDeviceId}
                    />

                    <Text style={styles.text}>Enter your Phone Number</Text>
                    <TextInput 
                        style={styles.inputText}
                        value={phone}
                        onChangeText={setPhone}
                    />

                    <Text style={styles.text}>Enter your Address</Text>
                    <TextInput 
                        style={styles.addressTest}
                        value={address}
                        onChangeText={setAddress}
                        multiline
                    />

                    <View>
                        <Text style={styles.text}>Latitude</Text>
                            <TextInput
                                style={styles.inputText}
                                value={latitude}
                                // onChangeText={(text) => setData({ ...data, latitude: text })}
                                editable={false}
                            />
                    </View>

                    <View>
                        <Text style={styles.text}>Longitude</Text>
                        <TextInput
                            style={styles.inputText}
                            value={longitude}
                            // onChangeText={(text) => setData({ ...data, longitude: text })}
                            editable={false}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '80%', height: 40 }]}
                        onPress={getLocation}
                    >
                        <Text style = {styles.text}>Get Location</Text><EvilIcons name="location" size={20} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.text}>Enter password:</Text>
                    <TextInput
                        value={password}
                        secureTextEntry={passvis}
                        onChangeText={setpassword}
                        style={styles.inputText}
                    />

                    <Text style={styles.text}>Confirm Password:</Text>
                    <TextInput
                        value={conpass}
                        secureTextEntry={passvis}
                        onChangeText={setconpass}
                        style={styles.inputText}
                    />

                    <TouchableOpacity
                        onPress={() => setpassvis(!passvis)}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>{passvis ? "Show Password" : "Hide Password"}</Text>
                    </TouchableOpacity>

                    {msg ? <Text style={[styles.text, { color: "red" }]}>{msg}</Text> : null}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            register(email, password, name, deviceId, phone, address, latitude, longitude).then((res) => {
                                if (res === "success") {
                                    navigation.navigate('login');
                                }else 
                                    setmsg(res);
                            });
                            // updateUser(name, photo, phone);
                        }
                    }
                    >
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>

                    <View style={styles.hr} />

                    <Text style={styles.text}>
                        Existing user? 
                        <Pressable onPress={() => navigation.navigate('login')}>
                            <Text style={styles.link}> Login here</Text>
                        </Pressable>
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

export default Register;
