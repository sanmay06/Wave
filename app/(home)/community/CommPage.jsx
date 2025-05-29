import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Menu from '@/components/ui/Menu';
import { ThemeContext } from "@/hooks/ThemeProvider";
import useAuth from '@/hooks/Auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { database } from '@/firebaseConfig';
import { get, ref } from 'firebase/database';

function CommPage({navigation, route}) {

    const { theme } = useContext(ThemeContext);
    const { id, page, deviceID } = route.params;
    console.log("Community ID:", id); // Log the community ID to verify it's being passed correctly
    return (
        <View style = {{width: '100%', height: '100%', backgroundColor: 'white'}}>
            <Menu navigation={navigation} back={true} />
            {/* <Text  style={styles.h1}>Community Page</Text> */}
            { 
              page === 'posts'? <Posts id = {id} navigation={navigation} devId = {deviceID}/> :
              page === 'proposals' ? <Proposals id = {id} navigation={navigation} devId = {deviceID}/> :
              page === 'emergency' ? <Emergency id = {id} navigation={navigation} devId = {deviceID}/> : null
            }
        </View>
    );
}

export default CommPage;

const Posts = (props) => {

    const [ posts, setPosts ] = useState([]);
    const [ deviceId, setDeviceId ] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        if(user) {
            setDeviceId(user.photoURL);
        }
    }, [user]);

    useEffect(() => {
        const fetchPosts = async () => {
            console.log("user:", user);
            try {
                if(!user) return;
                const deviceId = user.photoURL;
                const respo = await get(ref(database, `${deviceId}/profile/pincode`));
                const pincode = respo.val();
                const resp = await get(ref(database, `communities/${pincode}/${props.id}/posts`))
                // const data = resp.val();                
                setPosts(resp.val());
                console.log("Posts:", resp.val());
            }catch(error) {
                console.log(error);
            }
        }
        fetchPosts();
    }, [deviceId]);

    useEffect(() => {
        console.log("Posts:", posts);
    }, [posts]);

    const navigation = props.navigation;
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style = {styles.h1}>Posts</Text>
            {
                posts? Object.keys(posts).map((key) => {
                    const post = posts[key];
                    return (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("community/[page]/info", { id: props.id, page: 'posts', postId: key, deviceID: props.devId })}
                            style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
                            key={key}
                        >   
                            <View key={key} style={styles.card}>
                                <Text style={styles.headText}>{post.title}</Text>
                                <Text style = {styles.text}>{post.desc.length > 125 ? post.desc.substr(0, 125) + " ...": post.desc}</Text>
                                {<Text style = {styles.create}>Created by: {post.createdBy}</Text>
                                /*<Text>Created at: {new Date(post.createdAt).toLocaleString()}</Text> */}
                            </View>
                        </TouchableOpacity>
                    );
                }
                ) : <Text style = {styles.text}>No posts available. Try creating one</Text>
            }
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate("create/[page]", { id: props.id, page: 'posts' })}
            >
                <Ionicons name="add" size={24} color="black" />
            </TouchableOpacity>
        </ScrollView>
    );
};

const Proposals = (props) => {

    const [ proposals, setProposals ] = useState([]);
    const [ deviceId, setDeviceId ] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        if(user) {
            setDeviceId(user.photoURL);
        }
    }, [user]);

    useEffect(() => {
        const fetchPosts = async () => {
            console.log("user:", user);
            try {
                if(!user) return;
                const deviceId = user.photoURL;
                const respo = await get(ref(database, `${deviceId}/profile/pincode`));
                const pincode = respo.val();
                const resp = await get(ref(database, `communities/${pincode}/${props.id}/proposals`))
                // const data = resp.val();                
                setProposals(resp.val());
                console.log("Posts:", resp.val());
            }catch(error) {
                console.log(error);
            }
        }
        fetchPosts();
    }, [deviceId]);

    const navigation = props.navigation;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style = {styles.h1}>Proposals</Text>
            {
                proposals? Object.keys(proposals).map((key) => {
                    const post = proposals[key];
                    return (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("community/[page]/info", { id: props.id, page: 'proposals', postId: key, deviceID: props.devId })}
                            style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
                            key={key}
                        >   
                            <View key={key} style={styles.card}>
                                <Text style={styles.headText}>{post.title}</Text>
                                <Text style = {styles.text}>{post.desc.length > 125 ? post.desc.substr(0, 125) + " ...": post.desc}</Text>
                                {<Text style = {styles.create}>Created by: {post.createdBy}</Text>
                                /*<Text>Created at: {new Date(post.createdAt).toLocaleString()}</Text> */}
                            </View>
                        </TouchableOpacity>
                    );
                }
                ) : <Text style = {styles.text}>No posts available. Try creating one</Text>
            }
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate("create/[page]", { id: props.id, page: 'proposals' })}
            >
                <Ionicons name="add" size={24} color="black" />
            </TouchableOpacity>
        </ScrollView>
    );
}

const Emergency = (props) => {
    const [ posts, setPosts ] = useState([]);
    const [ deviceId, setDeviceId ] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        if(user) {
            setDeviceId(user.photoURL);
        }
    }, [user]);

    useEffect(() => {
        const fetchPosts = async () => {
            console.log("user:", user);
            try {
                if(!user) return;
                const deviceId = user.photoURL;
                const respo = await get(ref(database, `${deviceId}/profile/pincode`));
                const pincode = respo.val();
                const resp = await get(ref(database, `communities/${pincode}/${props.id}/emergency`))
                // const data = resp.val();                
                setPosts(resp.val());
                console.log("Posts:", resp.val());
            }catch(error) {
                console.log(error);
            }
        }
        fetchPosts();
    }, [deviceId]);

    useEffect(() => {
        console.log("Posts:", posts);
    }, [posts]);

    const navigation = props.navigation;
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style = {styles.h1}>Emergency Posts</Text>
            {
                posts? Object.keys(posts).map((key) => {
                    const post = posts[key];
                    return (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("community/[page]/info", { id: props.id, page: 'emergency', postId: key, deviceID: props.devId })}
                            style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
                            key={key}
                        >   
                            <View key={key} style={styles.card}>
                                <Text style={styles.headText}>{post.title}</Text>
                                <Text style = {styles.text}>{post.desc.length > 125 ? post.desc.substr(0, 125) + " ...": post.desc}</Text>
                                {<Text style = {styles.create}>Created by: {post.createdBy}</Text>
                                /*<Text>Created at: {new Date(post.createdAt).toLocaleString()}</Text> */}
                            </View>
                        </TouchableOpacity>
                    );
                }
                ) : <Text style = {styles.text}>No posts available. Try creating one</Text>
            }
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate("create/[page]", { id: props.id, page: 'emergency' })}
            >
                <Ionicons name="add" size={24} color="black" />
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = {
    container: {
      flexGrow: 1,
      padding: 16,
      width: '100%',
      backgroundColor: '#121212',
    },
    create: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 8,  
    },
    headText: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    h1: {
        color: '#FFFFFF',
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 10,
    },
    text: {
      color: '#E0E0E0',
      fontSize: 18,
      fontWeight: '500',
      marginBottom: 8,
    },
    card: {
      backgroundColor: '#1E1E1E',
      borderRadius: 12,
      padding: 16,
      width: '80%',
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
    },
    button: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      backgroundColor: '#007BFF',
      borderRadius: 28,
      height: 56,
      width: 56,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 5,
      elevation: 6,
    }
  };
  
