import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Menu from '@/components/ui/Menu';
import { ThemeContext } from "@/hooks/ThemeProvider";
import useAuth from '@/hooks/Auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { database } from '@/firebaseConfig';
import { ref, onValue, orderByChild, query } from 'firebase/database';
import RadialBackground from '@/components/ui/Background';

function CommPage({navigation, route}) {

    const { theme } = useContext(ThemeContext);
    const { id, page, deviceID } = route.params;

    const styles = {
        container: {
          flexGrow: 1,
          padding: 16,
          width: '100%',
          backgroundColor: 'transparent',
        },
        create: {
            color: theme.text,
            fontSize: 12,
            fontWeight: '500',
            marginBottom: 8,  
        },
        headText: {
          color: theme.primary,
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 8,
        },
        h1: {
            color: theme.primary,
            fontSize: 30,
            textAlign: 'center',
            marginBottom: 10,
        },
        text: {
          color: theme.text,
          fontSize: 18,
          fontWeight: '500',
          marginBottom: 8,
        },
        card: {
          backgroundColor: theme.card,
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
          backgroundColor: theme.button,
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

    console.log("Community ID:", id); // Log the community ID to verify it's being passed correctly
    return (
        <View style = {{width: '100%', height: '100%', flex: 1}}>
            <RadialBackground />
            <Menu navigation={navigation} back={true} />
            {/* <Text  style={styles.h1}>Community Page</Text> */}
            { 
              page === 'posts'? <Posts id = {id} navigation={navigation} devId = {deviceID} style = {styles} /> :
              page === 'proposals' ? <Proposals id = {id} navigation={navigation} devId = {deviceID} style = {styles} /> :
              page === 'emergency' ? <Emergency id = {id} navigation={navigation} devId = {deviceID} style = {styles} /> : null
            }
        </View>
    );
}

export default CommPage;

const Posts = (props) => {

    const [ posts, setPosts ] = useState();
    const { user } = useAuth();
    const styles = props.style;


    useEffect(() => {
        const q = query(ref(database, `communities/${props.id}/posts`), orderByChild('createdAt'));

        const unsubscribe = onValue(q, (snapshat) => {
            if(!snapshat.exists()) return;
            const orderedPosts = Object.entries(snapshat.val()).map(([key, value]) => ({
                key: key,
                ...value
            }));
            setPosts(orderedPosts.reverse());
        })
        return () => unsubscribe();

    }, []);

    const navigation = props.navigation;
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style = {styles.h1}>Posts</Text>
            {
                posts? posts.map((post) => {
                    return (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("community/[page]/info", { id: props.id, page: 'posts', postId: post.key, deviceID: props.devId })}
                            style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
                            key={post.key}
                        >   
                            <View key={post.key} style={styles.card}>
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
    const { user } = useAuth();
    const styles = props.style;

    //fetching data
    useEffect(() => {
        const q = query(
            ref(database, `communities/${props.id}/proposals`),
            orderByChild('createdAt'),
        );

        const unsubscribe = onValue(q, (snapshot) => {
            if(snapshot.exists()) {
                const orderedProposals = Object.entries(snapshot.val()).map(([ key, value ]) => ({
                    key: key,
                    ...value
                }));
                setProposals(orderedProposals.reverse());
            }
        })

        return () => unsubscribe();

    }, []);

    const navigation = props.navigation;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style = {styles.h1}>Proposals</Text>
            {
                proposals? proposals.map((proposal) => {
                    return (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("community/[page]/info", { id: props.id, page: 'proposals', postId: proposal.key, deviceID: props.devId })}
                            style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
                            key={proposal.key}
                        >   
                            <View style={styles.card}>
                                <Text style={styles.headText}>{proposal.title}</Text>
                                <Text style = {styles.text}>{proposal.desc.length > 125 ? proposal.desc.substr(0, 125) + " ...": proposal.desc}</Text>
                                {<Text style = {styles.create}>Created by: {proposal.createdBy}</Text>
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
};

const Emergency = (props) => {
    const [ posts, setPosts ] = useState([]);
    const [ deviceId, setDeviceId ] = useState('');
    const { user } = useAuth();
    const styles = props.style;

    useEffect(() => {
        if(user) {
            setDeviceId(user.photoURL);
        }
    }, [user]);

    useEffect(() => {
        const q = query(
            ref(database, `communities/${props.id}/emergency`),
            orderByChild('createdAt'),
        );

        const unsub = onValue(q, (snapshot) => {
            const data = snapshot.val();
            if(data) {
                const orderedPosts = Object.entries(data).map(([key, value]) => ({
                    key: key,
                    ...value
                }));
                setPosts(orderedPosts.reverse());
            }
        })

        return () => unsub();

    }, [deviceId]);

    const navigation = props.navigation;
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style = {styles.h1}>Emergency Posts</Text>
            {
                posts.length > 0? posts.map((post) => {
                    return (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("community/[page]/info", { id: props.id, page: 'emergency', postId: post.key, deviceID: props.devId })}
                            style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
                            key={post.key}
                        >   
                            <View key={post.key} style={styles.card}>
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
}; 
