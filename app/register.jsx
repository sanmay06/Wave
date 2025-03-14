import React, { useState, useContext, useEffect } from "react";
import { 
    Text, View, TouchableOpacity, StyleSheet, Dimensions, TextInput, Pressable, Image, Alert, Button 
} from "react-native";
import { ThemeContext } from "@/hooks/ThemeProvider";
import AntDesign from '@expo/vector-icons/AntDesign';
import useAuth from "@/hooks/Auth";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "react-native-image-picker";

function Register({ navigation }) {
    const { loggged, googleRegister, register, updateUser, uploadImage } = useAuth();
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
    const [photo, setPhoto] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [uploading, setUploading] = useState(false);

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

    // Pick Image Function
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

    const handleUploadImage = async () => {
        if (!imageUri) {
            Alert.alert("No Image", "Please select an image first.");
            return;
        }

        setUploading(true);
        try {
            const downloadURL = await uploadImage(imageUri);
            setPhoto(downloadURL); // Set the uploaded image URL
            Alert.alert("Upload Successful", "Image uploaded successfully!");
        } catch (error) {
            Alert.alert("Upload Failed", error.message);
        }
        setUploading(false);
    };

    return (
        <ScrollView 
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
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

                {/* Image Upload Section */}
                <Text style={styles.text}>Upload Profile Picture:</Text>
                <Button title="Pick an Image" onPress={pickImage} />
                {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, marginTop: 10 }} />}
                <Button title="Upload Image" onPress={handleUploadImage} disabled={uploading} />
                {photo && <Image source={{ uri: photo }} style={{ width: 100, height: 100, marginTop: 10 }} />}

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
                        setmsg(register(email, password));
                        updateUser(name, photo, phone);
                    }}
                >
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>

                <Text style={styles.text}>or Sign in with</Text>
                <TouchableOpacity 
                    onPress={googleRegister}
                    style={styles.googleButton}
                >
                    <AntDesign name="google" size={32} color={theme.text} />
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
    );
}

export default Register;
