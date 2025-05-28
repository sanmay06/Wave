import React, { useEffect, useState, useContext } from 'react';
import { Text, View, StyleSheet, TextInput, Dimensions, TouchableOpacity, Button, Alert } from 'react-native';
import Menu from '@/components/ui/Menu';
import useAuth from '@/hooks/Auth';
import { ThemeContext } from '@/hooks/ThemeProvider';
import { ref, get, set, push, update } from "firebase/database";
import { database } from '@/firebaseConfig';
import { useRoute } from '@react-navigation/native';
// import { storage } from '@/firebaseConfig.js';
// import { getDownloadURL, ref } from "firebase/storage";
// import * as ImagePicker from "react-native-image-picker";

function Profile({navigation}) {
    const { theme } = useContext(ThemeContext);
    const width = Dimensions.get('window').width;
    const { params } = useRoute();

    // console.log("tenent:",user);
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [ deviceId, setDeviceId ] = useState();
    const [ pincode, setPin ] = useState();

    useEffect(() => {
        setDeviceId(params.deviceID);
    }, []);

    const { user, updateUser } = useAuth(); 
    // useEffect(() => {
    //     if(user) {
    //         setDeviceId(user.photoURL);
    //     }
    //     console.log("Device ID:", deviceId,"user",user);
    // }, [user]);

    const styles = StyleSheet.create({
        mainContainer: {
            backgroundColor: theme.background,
            flex: 1,
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
            color: theme.button.color
        }
    });

    useEffect(() => {
        async function getData() {
            const snap = await get(ref(database, `${deviceId}/profile`))
            console.log(snap.val());
            if(snap.val()) {
                if(snap.val().uname)
                    setName(snap.val().uname);
                if(snap.val().phone_number)
                    setPhone(snap.val().phone_number);
                if(snap.val().email)
                    setEmail(snap.val().email);
                if(snap.val().address)
                setAddress(snap.val().address);
                if(snap.val().pincode)
                    setPin(snap.val().pincode);
            }
        }
        
        if(deviceId)
            getData();
    }, [deviceId]);

    const saveChanges = async () => {
        updateUser(name, deviceId);
        try {
            await update(ref(database, `${deviceId}/profile`), {
                uname: name,
                phone_number: phone,
                device_id: deviceId,
                address: address,
                email: email,
                pincode: pincode,
            });

            console.log("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <Menu navigation={navigation} />
            <View>
                <Text style={styles.text}>Username</Text>
                <TextInput
                    style={styles.inputText}
                    placeholder="Enter a Username"
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
            </View>
            <View>
                <Text style={styles.text}>Device ID</Text>
                <TextInput
                    style={styles.inputText}
                    placeholder="Enter your Device ID"
                    value={deviceId}
                    onChangeText={(text) => setDeviceId(text)}
                />
            </View>

            {/* Removed image-related UI */}
            {/* <Text style={styles.text}>Upload a diff Profile Picture:</Text>
            <Button title="Pick an Image" onPress={pickImage} />
            {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, marginTop: 10 }} />}
            <Button title="Upload Image" onPress={handleUploadImage} disabled={uploading} />
            {photo && <Image source={{ uri: photo }} style={{ width: 100, height: 100, marginTop: 10 }} />} */}

            <View>
                <Text style={styles.text}>E-Mail</Text>
                <TextInput
                    style={styles.inputText}
                    placeholder="Enter your E-Mail"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
            </View>
            <View>
                <Text style={styles.text}>Phone Number</Text>
                <TextInput
                    style={styles.inputText}
                    placeholder="Enter your Phone Number"
                    value={phone}
                    onChangeText={(text) => setPhone(text)}
                />
            </View>
            <View>
                <Text style={styles.text}>Address</Text>
                <TextInput
                    style={styles.addressTest}
                    placeholder="Enter your Address"
                    value={address}
                    onChangeText={(text) => setAddress(text)}
                />
            </View>
            <View>
                <Text style={styles.text}>Pincode</Text>
                <TextInput
                    style={styles.inputText}
                    placeholder="Enter your Pincode"
                    value={pincode}
                    onChangeText={(text) => setPin(text)}
                />
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => { saveChanges() }}
                disabled={disabled}
            >
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Profile;
