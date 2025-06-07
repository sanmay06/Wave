import React, { useState, useContext, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import Menu from '@/components/ui/Menu';
import { ThemeContext } from "@/hooks/ThemeProvider";
import useAuth from '@/hooks/Auth';
import { set, ref, get, update, push } from 'firebase/database';
import { database } from '@/firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';

const Create = ({ navigation, route }) => {

    const { theme } = useContext(ThemeContext);
    const { id, page } = route.params; 
    const { width } = Dimensions.get('window');
    const deviceId = route.params.deviceID;

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
        h1: {
            color: theme.labelText,
            fontSize: 30,
            textAlign: 'center',
            marginBottom: 10,
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
    });

    return (
        <View style={styles.mainContainer}>
            <Menu navigation={navigation} back={true} />
            <Text style={styles.h1}>Create {page}</Text>
            { 
                page === 'posts'? <Posts id = {id} navigation={navigation} style={styles} did = {deviceId}/> :
                page === 'proposals' ? <Proposals id = {id} navigation={navigation} style={styles} did = {deviceId}/> :
                page === 'emergency' ? <Emergency id = {id} navigation={navigation} style={styles} did = {deviceId}/> : null
            }
        </View>
    );
}

const Posts = (props) => {
    
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const styles = props.style;
    const navigation = props.navigation;
    const deviceId = props.did;

    const createPost = async() => {
        try {
            if(!user) return;
            const pushedId = await push(ref(database, `communities/${props.id}/posts`));
            await set(pushedId, {
                title: title,
                desc: desc,
                createdBy: user.displayName,
                createdAt: Date.now(),
                likes: {
                    count: 0,
                },
                dislikes: {
                    count: 0,
                },
                comments: {},
            }).then(() => {
                console.log("Post Created:", pushedId.key);
                navigation.navigate("community/[page]", { id: props.id, page: 'posts' });
            })
        }catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.text}>Enter Post Title</Text>
            <TextInput 
                style = {styles.inputText}
                value = {title}
                onChangeText = {(text) => setTitle(text)}
            />
            <Text style={styles.text}>Enter Post Description</Text>
            <TextInput 
                style = {styles.descText}
                multiline = {true}
                value = {desc}
                onChangeText = {(text) => setDesc(text)}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => createPost()}
            ><Text>Create</Text></TouchableOpacity>
        </View>
    );
};

const Proposals = (props) => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const styles = props.style;
    const navigation = props.navigation
    const [ options, setOptions ] = useState({});
    const [ count, setCount ] = useState(1); 
    const deviceId = props.did;

    const createPost = async() => {
        try {
            if(!user) return;
            const pushRef = await push(ref(database, `communities/${props.id}/proposals/`));
            await set(pushRef, {
                title: title,
                desc: desc,
                options: options,
                createdBy: user.displayName,
                createdAt: Date.now(),
                votes: {},
                comments: {},
            }).then(() => {
                console.log("Post Created:", pushRef.key);
                navigation.navigate("community/[page]", { id: props.id, page: 'proposals', deviceID: deviceId });
            })
        }catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.text}>Enter the Title</Text>
            <TextInput 
                style = {styles.inputText}
                value = {title}
                onChangeText = {(text) => setTitle(text)}
            />
            <Text style={styles.text}>Enter the Description</Text>
            <TextInput 
                style = {styles.descText}
                multiline = {true}
                value = {desc}
                onChangeText = {(text) => setDesc(text)}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>  
                <Text style={styles.text}>Enter the Options</Text>
                <TouchableOpacity
                    style={{ margin: 10, padding: 10, borderRadius: 5, borderWidth: 1, backgroundColor: '#ccc', alignItems: 'center', width: 40, height: 40, justifyContent: 'center' }}
                    onPress={ () => {
                        setCount(count + 1);
                        setOptions((prev) => ({ ...prev, [`option${count}`]: '' }));
                    } }
                >
                    <Ionicons name="add" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {Object.keys(options).map((key, idx) => (
                <View key={key} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <TextInput
                        style={[styles.inputText, { flex: 1 }]}
                        placeholder={`Option ${idx + 1}`}
                        value={options[key]}
                        onChangeText={(text) =>
                            setOptions((prev) => ({ ...prev, [key]: text }))
                        }
                    />
                    <TouchableOpacity
                        onPress={() => {
                            const newOptions = { ...options };
                            delete newOptions[key];
                            setOptions(newOptions);
                            setCount((prev) => Math.max(1, prev - 1));
                        }}
                        style={{
                            marginLeft: 8,
                            backgroundColor: '#ff4d4d',
                            padding: 8,
                            borderRadius: 5,
                        }}
                    >
                        <Ionicons name="trash" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            ))}


            <TouchableOpacity
                style={styles.button}
                onPress={() => createPost()}
            ><Text>Create</Text></TouchableOpacity>
        </View>
    );
}

const Emergency = (props) => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const styles = props.style;
    const navigation = props.navigation;
    const deviceId = props.did;

    const createPost = async() => {
        try {
            if(!user) return;
            const pushref = push(ref(database, `communities/${props.id}/emergency`));
            await set(pushref, {
                title: title,
                desc: desc,
                createdBy: user.displayName,
                createdAt: Date.now(),
                likes: 0,
                dislikes: 0,
            }).then(() => {
                console.log("Post Created:", pushref.key);
                navigation.navigate("community/[page]", { id: props.id, page: 'emergency', deviceID: deviceId });

            })
        }catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.text}>Enter the Title</Text>
            <TextInput 
                style = {styles.inputText}
                value = {title}
                onChangeText = {(text) => setTitle(text)}
            />
            <Text style={styles.text}>Enter the Description</Text>
            <TextInput 
                style = {styles.descText}
                multiline = {true}
                value = {desc}
                onChangeText = {(text) => setDesc(text)}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => createPost()}
            ><Text>Create</Text></TouchableOpacity>
        </View>
    );
}

export default Create;