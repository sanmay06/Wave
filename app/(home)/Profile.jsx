import React, { useEffect, useState, useContext } from 'react';
import { Text, View, StyleSheet, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import Menu from '@/components/ui/Menu';
import useAuth from '@/hooks/Auth';
import { ThemeContext } from '@/hooks/ThemeProvider';

function Profile(navigation) {
    const {theme} = useContext(ThemeContext);

    const width = Dimensions.get('window').width;

    const { user,updateUser } = useAuth();
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [photo, setPhoto] = useState('');
    const [disabled, setDisabled] = useState(false);

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
        },button: {
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
    });

    useEffect(() => {
        if(user) {
            if(user.displayName)
                setName(user.displayName);
            if(user.email)
                setEmail(user.email);
            if(user.phoneNumber)
                setPhone(user.phoneNumber);
            if(user.photoURL)
                setPhoto(user.photoURL);
        }
    }, [user]);

    // console.log(user);

    const saveChanges = () => {
        updateUser(name, photo, phone);
    };

    return (
        <View style={styles.mainContainer}>
            <Menu navigation={navigation}/>
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
                    style={styles.inputText}
                    placeholder="Enter your Address"
                    value={address}
                    onChangeText={(text) => setAddress(text)}
                />
            </View>
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => {saveChanges()}}
                disabled={disabled}
            >
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Profile;