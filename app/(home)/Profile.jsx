import React, { useEffect, useState, useContext } from 'react';
import { Text, View, StyleSheet, TextInput, Dimensions, TouchableOpacity, Button, Alert } from 'react-native';
import Menu from '@/components/ui/Menu';
import useAuth from '@/hooks/Auth';
import { ThemeContext } from '@/hooks/ThemeProvider';
import { ref, get, set, push, update } from "firebase/database";
import { database } from '@/firebaseConfig';
// import { storage } from '@/firebaseConfig.js';
// import { getDownloadURL, ref } from "firebase/storage";
// import * as ImagePicker from "react-native-image-picker";

function Profile({navigation}) {
    const { theme } = useContext(ThemeContext);
    const width = Dimensions.get('window').width;

    // console.log("tenent:",user);
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [photo, setPhoto] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [ deviceId, setDeviceId ] = useState();
    
    const { user, updateUser } = useAuth(); 
    useEffect(() => {
        if(user) {
            setDeviceId(user.photoURL);
        }
    }, [user]);

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

    // Removed image selection function
    /*
    const pickImage = () => {
        ImagePicker.launchImageLibrary({ mediaType: "photo" }, (response) => {
            if (response.didCancel) {
                Alert.alert("Cancelled", "Image selection was cancelled.");
            } else if (response.errorMessage) {
                Alert.alert("Error", response.errorMessage);
            } else {
                setImageUri(response.assets[0].uri);
            }
        });
    };
    */

    // Removed image upload function
    /*
    const handleUploadImage = async () => {
        if (!imageUri) {
            Alert.alert("No Image", "Please select an image first.");
            return;
        }

        setUploading(true);
        try {
            const downloadURL = await uploadImage(imageUri, deviceId);
            setPhoto(downloadURL); // Set the uploaded image URL
            Alert.alert("Upload Successful", "Image uploaded successfully!");
        } catch (error) {
            Alert.alert("Upload Failed", error.message);
        }
        setUploading(false);
    };
    */

    useEffect(() => {
        // if (user) {
        //     if (user.displayName) setName(user.displayName);
        //     if (user.email) setEmail(user.email);
        //     if (user.phoneNumber) setPhone(user.phoneNumber);
        //     if (user.photoURL) setPhoto(user.photoURL);
        // }
        async function getData() {
            const snap = await get(ref(database, `${deviceId}/profile`))
            console.log(snap.val());
            setName(snap.val().uname);
            setPhone(snap.val().phone_number);
            setEmail(snap.val().email);
            setDeviceId(snap.val().device_id);
            setAddress(snap.val().address);
        }
        
        if(deviceId)
            getData();
    }, [user]);

    const saveChanges = async () => {
        updateUser(name, deviceId);
        try {
            await update(ref(database, `${deviceId}/profile`), {
                uname: name,
                phone_number: phone,
                device_id: deviceId,
                address: address,
                email: email,
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
