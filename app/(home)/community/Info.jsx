import React, { useState, useEffect, useContext } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import { database } from '@/firebaseConfig';
import { set, ref, get, update, onValue, push, query, orderByChild } from 'firebase/database';
import useAuth from '@/hooks/Auth';
import AntDesign from '@expo/vector-icons/AntDesign';
import Menu from '@/components/ui/Menu';
import Ionicons from '@expo/vector-icons/Ionicons';
import RadialBackground from '@/components/ui/Background';
import { ThemeContext } from '@/hooks/ThemeProvider';

const Info = ({ navigation, route }) => {


    const { id, page, postId, deviceID } = route.params;
    console.log('Info', id, page, postId);
    const [ uid, setUid ] = useState(null);
    const { user } = useAuth();
    const [ uname, setUname ] = useState(null);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        if(user) {
            setUid(user.uid);
            setUname(user.displayName);
        }
    }, [user]);

    const styles = StyleSheet.create({
        container:{
            flex: 1,
            width: '100%',
            backgroundColor: 'transparent',
            minHeight: '100%',
            alignItems: 'center',
        },
        h1: {
            color: theme.text,
            fontSize: 30,
            textAlign: 'center',
            marginBottom: 10,
        },
        h3: {
            color: theme.text,
            fontSize: 20,
            textAlign: 'center',
            marginBottom: 10,
        },
        card: {
            backgroundColor: theme.background ,
            borderRadius: 12,
            padding: 16,
            width: '100%',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 5,
            marginTop: 12,
        },
        label: {
            color: theme.text,
            fontSize: 16,
            fontWeight: 'bold',
            marginTop: 8,
        },
        value: {
            color: theme.button.color,
            fontSize: 18,
            marginBottom: 12,
            backgroundColor: theme.button.background,
            borderRadius: 8,
            padding: 8,            
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 5,
            marginTop: 12,
        },
        secCard: {
            borderRadius: 12,
            padding: 16,
            width: '100%',
        },
        misContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 12,
        },
        inputContainer: {
            backgroundColor: theme.button.background,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginTop: 12,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 5,
          },
          input: {
            flex: 1,
            color: theme.button.color,
            fontSize: 16,
            paddingVertical: 4,
            paddingRight: 8,
            width: '80%'
          },
          sendButton: {
            padding: 6,
            justifyContent: 'center',
            alignItems: 'center',
          },
    });

    return (
        <View style = {{flex: 1 }}>
            <RadialBackground />
            <ScrollView contentContainerStyle={styles.container}>
                <Menu navigation = {navigation} back = {true} />
                <View style = {[{flex: 1, width: '100%'}]}>
                        {
                            page === 'posts'? <Post id = {id} postId = {postId} styles = {styles} deviceId = {deviceID} uid = {uid} name = {uname} theme = {theme}/> :
                            page === 'proposals'? <Proposals id = {id} postId = {postId} styles = {styles} deviceId = {deviceID} uid = {uid} name = {uname} theme = {theme}/> :
                            page === 'emergency'? <Emergency id = {id} postId = {postId} styles = {styles} deviceId = {deviceID} uid = {uid} name = {uname} theme = {theme}/> : null
                        }
                </View>
            </ScrollView>
        </View>
    )
}

export default Info;

const Post = (props) => {

    // const { user } = useAuth();
    const styles = props.styles;

    const deviceId = props.deviceId;
    const theme = props.theme;

    const [ like, setLike ] = useState(0);
    const [ post, setPost ] = useState(null);
    const [ lcount, setlCount ] = useState(0);
    const [ dcount, setdCount ] = useState(0);
    const [ comments, setComments ] = useState([]);
    const [ comment, setComment ] = useState('');
    const uid = props.uid;

    useEffect(() => {
        // console.log('Device ID:', deviceId);

        const unsub = onValue(ref(database, `communities/${props.id}/posts/${props.postId}`), (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setPost(data);
                setlCount(data.likes.count ?? 0);
                setdCount(data.dislikes.count ?? 0);
                if (data.likes[deviceId] !== null && data.likes[deviceId] === 1) {
                    setLike(1);
                } else if (data.dislikes[deviceId] === 1) {
                    setLike(-1);
                } else {
                    setLike(0);
                }
            }
        })

        return () => unsub();
    }, [deviceId]);

    useEffect(() => {

        const q = query(
            ref(database, `communities/${props.id}/posts/${props.postId}/comments`),
            orderByChild('createdAt'),
        )
        const unsubscribe = onValue(q, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const commentsArray = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value,
                }));
                setComments(commentsArray);
                console.log('Comments:', commentsArray);
            } else {
                setComments([]);
            }
        })

        return () => unsubscribe();

    }, []);

const saveComment = async() => {
    try {
        if(!uid || !comment.trim()) return;
        const pref = push(ref(database, `communities/${props.id}/posts/${props.postId}/comments`));
        set(pref, {
            userId: uid,
            comment: comment.trim(),
            createdAt: Date.now(),
            username: props.name,
        })
    }catch(error) {
        console.log('Error saving comment:', error);  
    }
    setComment('');
}

const toggleLike = async (type) => {
  try {
    if (!deviceId) return;

    // Only fetch pincode once
    const res = await get(ref(database, `${deviceId}/profile/pincode`));
    const pincode = res.val();
    const basePath = `communities/${pincode}/${props.id}/posts/${props.postId}`;
    
    let updates = {};
    let newLike = like;

    if (type === 'like') {
      if (like === 0 || like === -1) {
        newLike = 1;
        updates[`${basePath}/likes/${deviceId}`] = 1;
        updates[`${basePath}/dislikes/${deviceId}`] = 0;
        updates[`${basePath}/likes/count`] = (lcount ?? 0) + 1;
        if (like === -1) {
          updates[`${basePath}/dislikes/count`] = (dcount ?? 0) - 1;
        }
        setlCount(lcount + 1);
        if (like === -1) setdCount(dcount - 1);
      } else {
        newLike = 0;
        updates[`${basePath}/likes/${deviceId}`] = 0;
        updates[`${basePath}/dislikes/${deviceId}`] = 0;
        updates[`${basePath}/likes/count`] = (lcount ?? 0) - 1;
        setlCount(lcount - 1);
      }
    } else if (type === 'dislike') {
      if (like === 0 || like === 1) {
        newLike = -1;
        updates[`${basePath}/likes/${deviceId}`] = 0;
        updates[`${basePath}/dislikes/${deviceId}`] = 1;
        updates[`${basePath}/dislikes/count`] = (dcount ?? 0) + 1;
        if (like === 1) {
          updates[`${basePath}/likes/count`] = (lcount ?? 0) - 1;
        }
        setdCount(dcount + 1);
        if (like === 1) setlCount(lcount - 1);
      } else {
        newLike = 0;
        updates[`${basePath}/likes/${deviceId}`] = 0;
        updates[`${basePath}/dislikes/${deviceId}`] = 0;
        updates[`${basePath}/dislikes/count`] = (dcount ?? 0) - 1;
        setdCount(dcount - 1);
      }
    }

    setLike(newLike);
    await update(ref(database), updates);
  } catch (error) {
    console.error('toggleLike error:', error);
  }
};


    return (
        
            <View style={styles.card}>
                <Text style = {styles.h1}>Post</Text>
                <View style = {styles.secCard}>
                    <Text style = {styles.label}>Title: </Text>
                    <Text style = {styles.value}>{post ?post.title: null}</Text>
                </View>
                <View style = {styles.secCard}>
                    <Text style = {styles.label}>Description: </Text>
                    <Text style = {styles.value}>{post ? post.desc: null}</Text>
                </View>
                <View style = {styles.misContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
                        {/* Like */}
                        <View style={{ alignItems: 'center', marginRight: 24 }}>
                            <TouchableOpacity 
                                style={{
                                    padding: 10,
                                    borderRadius: 12,
                                    backgroundColor: theme.button.background,
                                }}
                                onPress={() => toggleLike('like')}
                            >
                                <AntDesign 
                                    name={like === 1 ? "like1" : "like2"} 
                                    size={24} 
                                    color={like === 1 ? "#00FF00" : "#FFFFFF"} 
                                />
                            </TouchableOpacity>
                            <Text style={{ color: theme.text, fontSize: 16, marginTop: 6 }}>
                                {lcount??  0}
                            </Text>
                        </View>

                        {/* Dislike */}
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity 
                                style={{
                                    padding: 10,
                                    borderRadius: 12,
                                    backgroundColor: theme.button.background,
                                }}
                                onPress={() => toggleLike('dislike')}
                            >
                                <AntDesign 
                                    name={like === -1 ? "dislike1" : "dislike2"} 
                                    size={24} 
                                    color={like === -1 ? "#FF0000" : "#FFFFFF"} 
                                />
                            </TouchableOpacity>
                            <Text style={{ color: theme.text, fontSize: 16, marginTop: 6 }}>
                                {dcount?? 0}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style = {styles.label}>Posted By: </Text>
                            <Text style = {styles.label}>{post ? post.createdBy: null}</Text>
                        </View>
                        <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style = {styles.label}>Posted On: </Text>
                            <Text style = {styles.label}>{post ? new Date(post.createdAt).toLocaleDateString() : null}</Text>
                        </View>
                    </View>
                </View>
                <View style={[{ flexDirection: 'row', alignItems: 'center' }, styles.inputContainer]}>
                    <TextInput 
                        style={styles.input}
                        value={comment}
                        onChangeText={setComment}
                        placeholder="Type your comment"
                        placeholderTextColor="#AAAAAA"
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={saveComment}>
                        <Ionicons name="send" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <Text style = {styles.h3}>Comments</Text>
                <View style={{ marginTop: 12, width: '100%' }}>
                    {comments.length > 0? comments.map((c) => (
                        <View key={c.id} style={{ marginBottom: 12, padding: 12, backgroundColor: theme.card, borderRadius: 8 }}>
                            <Text style={{ color: theme.text, fontSize: 16 }}>{c.comment}</Text>
                            <Text style={{ color: '#AAAAAA', fontSize: 14, marginTop: 4 }}>
                                {c.username} - {new Date(c.createdAt).toLocaleDateString()}      
                            </Text>
                        </View>
                    )) : <Text style={{ color: theme.text, fontSize: 16 }}>No comments yet</Text>}
                </View>
            </View>
    )
}

const Proposals = (props) => {
    const styles = props.styles;
    // const { user } = useAuth();
    const uid = props.uid;
    const theme = props.theme;

    const [proposal, setProposal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [ comment, setComment ] = useState('');
    const [ comments, setComments ] = useState([]);
    const deviceId = props.deviceId

    // useEffect(() => {
    //     if (user) setDeviceId(user.photoURL);
    // }, [user]);

    useEffect(() => {
        const q = query(
            ref(database,`communities/${props.id}/proposals/${props.postId}`),
            orderByChild('createdAt'),
        )

        const qc = query (
            ref(database, `communities/${props.id}/proposals/${props.postId}/comments`),
            orderByChild('createdAt'),
        )

        const unsubC = onValue(qc, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const commentsArray = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value,
                }));
                setComments(commentsArray);
            } else {
                setComments([]);
            }
        });

        const unsub = onValue(q, (snapshot) => {
            const data = snapshot.val();
            if(data) {
                setProposal(data);
                if (data?.votes?.[deviceId] !== undefined) {
                    setSelected(data.votes[deviceId]);
                }
            }
        })

        return () => {unsub(); unsubC();}

    }, []);

    const handleVote = async (index) => {
        if (selected === index || !deviceId) return;
    
        const path = `communities/${props.id}/proposals/${props.postId}`;
        const previousVote = selected;
    
        const rawCounts = proposal?.voteCounts || {};
        const counts = { ...rawCounts };
    
        // Increment new vote
        counts[index] = isNaN(counts[index]) ? 1 : counts[index] + 1;
    
        // Decrement previous vote
        if (previousVote !== null && previousVote !== index) {
            counts[previousVote] =
                isNaN(counts[previousVote]) || counts[previousVote] <= 0
                    ? 0
                    : counts[previousVote] - 1;
        }
    
        // Ensure no NaN values
        Object.keys(counts).forEach(k => {
            if (isNaN(counts[k])) counts[k] = 0;
        });
    
        // Atomic update
        await update(ref(database, path), {
            [`votes/${deviceId}`]: index,
            voteCounts: counts,
        });
    
        setSelected(index);
    };
    
    const saveComment = async() => {
        try {
            if(!uid || !comment.trim()) return;
            const pref = push(ref(database, `communities/${props.id}/proposals/${props.postId}/comments`));
            set(pref, {
                userId: uid,
                comment: comment.trim(),
                createdAt: Date.now(),
                username: props.name,
            })
        }catch(error) {
            console.log('Error saving comment:', error);  
        }
        setComment('');
    }

    const getWinningOptions = () => {
        if (!proposal?.voteCounts) return [];
        const maxVotes = Math.max(...Object.values(proposal.voteCounts));
        return Object.keys(proposal.voteCounts)
            .filter(key => proposal.voteCounts[key] === maxVotes)
            .map(k => parseInt(k));
    };

    return (
        <View style={styles.card}>
            <Text style={styles.h1}>Proposals</Text>

            <View style={styles.secCard}>
                <Text style={styles.label}>Title:</Text>
                <Text style={styles.value}>{proposal?.title ?? ''}</Text>
            </View>

            <View style={styles.secCard}>
                <Text style={styles.label}>Description:</Text>
                <Text style={styles.value}>{proposal?.desc ?? ''}</Text>
            </View>

            {proposal?.options &&
                Object.entries(proposal.options).map(([indexStr, value]) => {
                    const index = parseInt(indexStr.replace('option', ''));
                    const isWinner = getWinningOptions().includes(index);
                    const count = proposal.voteCounts?.[index] ?? 0;

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleVote(index)}
                            style={{
                                marginTop: 12,
                                padding: 12,
                                borderRadius: 10,
                                backgroundColor: selected === index ? theme.button.background : theme.background,
                                borderColor: isWinner ? '#FFD700' : '#555',
                                borderWidth: 2,
                            }}
                        >
                            <Text style={{ color: theme.text , fontSize: 16 }}>
                                {value} - {count} vote{count !== 1 ? 's' : ''} {isWinner ? '🏆' : ''}
                            </Text>
                        </TouchableOpacity>
                    );
                })
            }
            <View style = {styles.misContainer}>
                <Text style={styles.label}>Posted By: {proposal?.createdBy}</Text>
                <Text style={styles.label}>Posted At: {new Date(proposal?.createdAt).toLocaleDateString()}</Text>
            </View>
            <View style={[{ flexDirection: 'row', alignItems: 'center' }, styles.inputContainer]}>
                    <TextInput 
                        style={styles.input}
                        value={comment}
                        onChangeText={setComment}
                        placeholder="Type your comment"
                        placeholderTextColor="#AAAAAA"
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={saveComment}>
                        <Ionicons name="send" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <Text style = {styles.h3}>Comments</Text>
                <View style={{ marginTop: 12, width: '100%' }}>
                    {comments.length > 0? comments.map((c) => (
                        <View key={c.id} style={{ marginBottom: 12, padding: 12, backgroundColor: theme.background, borderRadius: 8 }}>
                            <Text style={{ color: theme.text, fontSize: 16 }}>{c.comment}</Text>
                            <Text style={{ color: '#AAAAAA', fontSize: 14, marginTop: 4 }}>
                                {c.username} - {new Date(c.createdAt).toLocaleDateString()}      
                            </Text>
                        </View>
                    )) : <Text style={{ color: '#AAAAAA', fontSize: 16 }}>No comments yet</Text>}
                </View>
        </View>
    );
};

const Emergency = (props) => {
    const { styles, theme, id, postId } = props;
    const [emergency, setEmergency] = useState(null);
  
    useEffect(() => {
      const q = query(
        ref(database, `communities/${id}/emergency/${postId}`),
        orderByChild('createdAt')
      );
      const unsub = onValue(q, snapshot => {
        setEmergency(snapshot.val());
      });
      return () => unsub();
    }, []);
  
    return (
      <View style={styles.card}>
        <Text style={styles.h1}>Emergency</Text>
  
        <View style={styles.secCard}>
          <Text style={styles.label}>Title:</Text>
          <Text style={styles.value}>{emergency?.title ?? ''}</Text>
        </View>
  
        <View style={styles.secCard}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{emergency?.desc ?? ''}</Text>
        </View>
  
        <View style={styles.secCard}>
          <Text style={styles.label}>Posted By:</Text>
          <Text style={styles.value}>{emergency?.createdBy ?? ''}</Text>
        </View>
  
        <View style={styles.secCard}>
          <Text style={styles.label}>Posted At:</Text>
          <Text style={styles.value}>
            {emergency?.createdAt
              ? new Date(emergency.createdAt).toLocaleDateString()
              : ''}
          </Text>
        </View>
      </View>
    );
  };
  