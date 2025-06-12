import React, { useState, useEffect, useContext } from 'react';
import { View, Text,ScrollView,StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { database } from '@/firebaseConfig';
import { get, ref, set, child, query, push } from 'firebase/database';
import { ThemeContext } from '@/hooks/ThemeProvider';
import Menu from '@/components/ui/Menu';
import { useRoute } from '@react-navigation/native';
import useAuth from '@/hooks/Auth';
import RadialBackground from '@/components/ui/Background';

function CreateComm({navigation}) {

    const { theme } = useContext(ThemeContext);
    const { width } = Dimensions.get('window');
    const [ position, setPosition ] = useState('');
    const [ name, setName ] = useState('');
    const [ type, setType ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ memberCount, setMemberCount ] = useState(1);
    const { user } = useAuth();

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

    useEffect(() => {
        const getPosition = async () => {
            if(deviceId)
                try {
                    const response = await get(ref(database, `${deviceId}/profile`));
                    setPosition(
                        {
                            latitude: response.val().latitude,
                            longitude: response.val().longitude,
                        }
                    );
                }catch (error) {
                    console.log(error);
                }
        }
        getPosition();
    }, [deviceId]);

    return (
        <ScrollView contentContainerStyle = {styles.mainContainer}>
            <RadialBackground />
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
            <TouchableOpacity style = {[styles.button, { backgroundColor: theme.button.background }]} onPress = {() => {
                if(name && description && memberCount && type && position) {
                    
                    const communityData = {
                        name: name,
                        location: {
                            latitude: position.latitude,
                            longitude: position.longitude,
                        },
                        createdBy: user.uid,
                        createdAt: new Date().toString(),
                        description: description,
                        members: {
                            [user.uid]: {
                                joinedAt: new Date().toString(),
                            }
                        }
                    };

                    if (type === "invite only") {
                        communityData.requests = {};
                    }

                    try {
                        const pushRef = push(ref(database, 'communities'));
                        const communityId = pushRef.key;
                        set(pushRef, communityData);
                        console.log('Community created successfully!');
                        set(ref(database, `${deviceId}/community`), communityId);
                    }catch (error) {
                        console.log(error);
                    }
                    navigation.navigate('community', { deviceID: deviceId });
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