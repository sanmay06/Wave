import React, { useEffect, useState, useContext } from 'react';
import { Text, View, StyleSheet, TextInput, Dimensions, TouchableOpacity, Button, Alert } from 'react-native';
import Menu from '@/components/ui/Menu';
import useAuth from '@/hooks/Auth';
import { ThemeContext } from '@/hooks/ThemeProvider';
import { ref, get, set, push, update, onValue } from "firebase/database";
import { database } from '@/firebaseConfig';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'moti';
import * as Location from 'expo-location';
import EvilIcons from '@expo/vector-icons/EvilIcons';


function Profile({navigation}) {
    const { theme } = useContext(ThemeContext);
    const width = Dimensions.get('window').width;
    const { params } = useRoute();

    const [ edit, setEdit ] = useState(true);
    const [ deviceId, setDeviceId ] = useState();
    const [ data, setData ] = useState({
        uname: '',
        email: '',
        phone_number: '',
        address: '',
        latitude: '',
        longitude: '',
        pincode: ''
    });

    useEffect(() => {
        setDeviceId(params.deviceID);
    }, []);

    const { updateUser } = useAuth(); 

    const styles = StyleSheet.create({
        mainContainer: {
            backgroundColor: theme.background,
            width: '100%',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            flexGap: 10,
        },
        link: {
            color: "#4285F4",
            textDecorationLine: 'underline'
        },
        hr: {
            height: 1,
            width: width * 0.75,
            borderBottomWidth: 5,
            borderBottomColor: theme.text,
        },
        text: {
            color: theme.labelText,
            fontSize: 20,
            padding: 20,
            textAlign: 'center',
            textAlignVertical: 'center',
        },
        button: {
            margin: 20,
            padding: 10,
            width: 100,
            alignItems: 'center',
            marginTop: 50,
            borderRadius: 5,
            borderWidth: 1,
            color: theme.text,
            backgroundColor: theme.button.background,
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
            color: theme.button.color,
        }
    });

    useEffect(() => {
        const unsubscribe = onValue(ref(database, `${deviceId}/profile`), (snapshot) => {
            if(snapshot.exists()) {
                const profileData = snapshot.val();
                setData(profileData);
            }
        });
        
        return () => unsubscribe;
    }, [deviceId]);

    
    return (
        <View style={styles.mainContainer}>
            <Menu navigation={navigation} />
            <View style={{ width: '100%', alignItems: 'center', marginTop: 20 }}>
                <Text style={styles.text}>Profile</Text>
                <View style={styles.hr} />
            </View>

            {edit? 
                <DisplayProfile data = {data} style = {styles} setEdit = {setEdit} deviceID = {deviceId}/> :
                <EditProfile data={data} styles={styles} updateUser={updateUser} deviceId={deviceId} setEdit = {setEdit} setData = {setData}/>
            }

        </View>
    );
}

export default Profile;

const DisplayProfile = ( props ) => {
    const data = props.data;
    const styles = props.style;

    return (
        <View style={{ alignItems: 'center', width: '100%' }}>
            <Text style={styles.text}>Username: {data?.uname}</Text>
            <Text style={styles.text}>Device ID: {props.deviceID}</Text>
            <Text style={styles.text}>E-Mail: {data?.email}</Text>
            <Text style={styles.text}>Phone Number: {data?.phone_number}</Text>
            <Text style={styles.text}>Address: {data?.address }</Text>
            <Text style={styles.text}>Latitude: {data?.latitude }</Text>
            <Text style={styles.text}>Longitude: {data?.longitude }</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => props.setEdit(false)}
            >
                <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
        </View>
    )
};

const EditProfile = ( props ) => {

    const data = props.data;
    const styles = props.styles;
    const deviceId = props.deviceId;    
    const width = Dimensions.get('window').width;
    const setData = props.setData;

    const saveChanges = async () => {
        props.updateUser(data.uname, deviceId);
        try {
            await update(ref(database, `${deviceId}/profile`), data);
            console.log("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
        props.setEdit(true);
    };

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission to access location was denied");
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setData({
            ...data,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        });
    }

    return (
            <ScrollView contentContainerStyle={{ alignItems: 'center', width: '100%', flexGrow: 1 }} 
                showsVerticalScrollIndicator={false}
            >
                <View style = {{width: width - 20}}></View>
                <View >
                    <Text style={styles.text}>Username</Text>
                    <TextInput
                        style={styles.inputText}
                        placeholder="Enter a Username"
                        value={data?.uname? data.uname : ''}
                        onChangeText={(text) => setData({ ...data, uname: text })}
                        // editable={!disabled}
                    />
                </View>
                <View>
                    <Text style={styles.text}>Device ID</Text>
                    <TextInput
                        style={styles.inputText}
                        placeholder="Enter your Device ID"
                        value={deviceId}
                        editable={false}
                    />
                </View>

                <View>
                    <Text style={styles.text}>E-Mail</Text>
                    <TextInput
                        style={styles.inputText}
                        placeholder="Enter your E-Mail"
                        value={data.email}
                        onChangeText={(text) => setData({ ...data, email: text })}
                        editable={false}

                    />
                </View>
                <View>
                    <Text style={styles.text}>Phone Number</Text>
                    <TextInput
                        style={styles.inputText}
                        placeholder="Enter your Phone Number"
                        value={data.phone_number}
                        onChangeText={(text) => setData({ ...data, phone_number: text })}
                        // editable={!disabled}
                    />
                </View>
                <View>
                    <Text style={styles.text}>Address</Text>
                    <TextInput
                        style={styles.addressTest}
                        placeholder="Enter your Address"
                        value={data.address}
                        onChangeText={(text) => setData({ ...data, address: text })}
                        // editable={!disabled}
                    />
                </View>

                <View>
                    <Text style={styles.text}>Latitude</Text>
                    <TextInput
                        style={styles.inputText}
                        value={data.latitude}
                        // onChangeText={(text) => setData({ ...data, latitude: text })}
                        editable={false}
                    />
                </View>

                <View>
                    <Text style={styles.text}>Longitude</Text>
                    <TextInput
                        style={styles.inputText}
                        value={data.longitude}
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

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => { saveChanges() }}
                    // disabled={disabled}
                >
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </ScrollView>
    );


};
