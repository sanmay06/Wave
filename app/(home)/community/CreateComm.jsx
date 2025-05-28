import useAuth from '@/hooks/Auth';
import React, { useState, useEffect, useContext } from 'react';
import { View, Text,ScrollView,StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { database } from '@/firebaseConfig';
import { get, ref, set, child } from 'firebase/database';
import { ThemeContext } from '@/hooks/ThemeProvider';
import Menu from '@/components/ui/Menu';
import { useRoute } from '@react-navigation/native';

function CreateComm({navigation}) {

    // const { user } = useAuth();
    const { theme } = useContext(ThemeContext);
    const { width } = Dimensions.get('window');
    // const [ deviceId, setDeviceId ] = useState('');
    const [ pincode, setPincode ] = useState('');
    const [ cummunityId, setCommunityId ] = useState('');
    const [ name, setName ] = useState('');
    const [ type, setType ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ memberCount, setMemberCount ] = useState(1);

    const deviceId = useRoute().params.deviceID;

    const styles = StyleSheet.create({
        mainContainer: {
            backgroundColor: theme.background,
            alignItems: 'center',
            width: '100%',
            minHeight: '100%',
        },
        link: {
            color: "#0056b3",
            textDecorationLine: 'underline',
        },
        descText: {
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
        radioBox: {
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    // useEffect(() => {
    //     if(user) {
    //         setDeviceId(user.photoURL);
    //     }
    // }, [user]);

    useEffect(() => {
        const getPinCode = async () => {
            if(deviceId)
                try {
                    const response = await get(ref(database, `${deviceId}/profile/pincode`));
                    setPincode(response.val());
                }catch (error) {
                    console.log(error);
                }
        }
        getPinCode();
        console.log("Device ID:", deviceId);
        console.log("Pincode:", pincode);
    }, [deviceId]);

    return (
        <ScrollView contentContainerStyle = {styles.mainContainer}>
            <Menu navigation={navigation} back = {true}/>
            <Text style = {styles.text}>Create Community</Text>
            <Text style={styles.text}>Enter the community name</Text>
            <TextInput 
                style={styles.inputText}
                value={name}
                onChangeText={setName}
            />
            <Text style={styles.text}>Enter the description for the community</Text>
            <TextInput 
                style={styles.descText}
                value={description}
                onChangeText={setDescription}
            />
            <Text style={styles.text}>Enter the Maximum members that can join</Text>
            <TextInput 
                style={styles.inputText}
                value={memberCount}
                onChangeText={setMemberCount}
                keyboardType="numeric"
            />
            <Text style={styles.text}>Select the type of community</Text>
            <View style = {styles.radioBox}>
                <RadioButton text = 'Anyone can join' selected = {type == 'Anyone can join'} pressed = {() => setType('Anyone can join')} theme={theme}/>
                <RadioButton text = 'Invite only' selected = {type == 'Invite only'} pressed = {() => setType('Invite only')} theme = {theme}/>
            </View>
            <TouchableOpacity style = {[styles.button, { backgroundColor: theme.button.background }]} onPress = {() => {
                if(name && description && memberCount && type && pincode) {

                    const baseId = user.uid + name;
                    const communityRef = ref(database, `communities/${pincode}`);
                    get(child(communityRef, baseId)).then((snapshot) => {
                        let finalId = baseId;
                        
                        if (snapshot.exists()) {
                            // ID exists, so create a new unique ID
                            finalId = baseId + "_" + Date.now(); // You could also increment a number instead
                        }
                        setCommunityId(finalId);

                        const communityData = {
                            name: name,
                            type: type,
                            createdBy: user.uid,
                            createdAt: new Date().toString(),
                            description: description,
                            memberCount: memberCount,
                            members: {
                                [user.uid]: {
                                    isAdmin: true,
                                    joinedAt: new Date().toString(),
                                }
                            }
                        };

                        if (type === "invite only") {
                            communityData.requests = {};
                        }
                        try {               
                            set(ref(database, `communities/${pincode}/${finalId}`), communityData)
                            .then(() => {
                                console.log('Community created successfully!');
                            })
                            .catch((error) => {
                                console.log('Error creating community:', error);
                            });
                        
                            set(ref(database, `${deviceId}/community`), finalId)
                        }catch (error) {
                            console.log(error);
                        }
                    });
                }
            }}>
                <Text style = {[styles.buttonText, { color: theme.button.color }]}>Create Community</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

export default CreateComm;

const RadioButton = ( props ) => {

    const styles = StyleSheet.create({
        radioButton: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginVertical: 8,
            borderWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 280,
            borderColor: props.selected ? '#007BFF' : props.theme.button.background,
        },
        radioButtonText: {
            fontSize: 16,
        },
    });

    return (
        <TouchableOpacity style={[ styles.radioButton, { backgroundColor : props.selected ? '#007BFF' : props.theme.background } ]} onPress={props.pressed}>
            <Text style = {[styles.radioButtonText, { color : props.selected ? '#FFF' : props.theme.text }]}>{props.text}</Text>
        </TouchableOpacity>
    )
}