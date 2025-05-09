import React, { useState, useEffect, useContext } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { database } from '@/firebaseConfig';
import { set, ref, get, update, onValue } from 'firebase/database';
import useAuth from '@/hooks/Auth';
import AntDesign from '@expo/vector-icons/AntDesign';
import Menu from '@/components/ui/Menu';
import { ThemeContext } from '@/hooks/ThemeProvider';

const Info = ({ navigation, route }) => {

    const { id, page, postId } = route.params;
    console.log('Info', id, page, postId);

    const styles = StyleSheet.create({
        container:{
            // flexGrow: 1,
            padding: 16,
            width: '100%',
            backgroundColor: '#121212',
            minHeight: '100%',
            alignItems: 'center',
        },
        h1: {
            color: '#FFFFFF',
            fontSize: 30,
            textAlign: 'center',
            marginBottom: 10,
        },
        h3: {
            color: '#FFFFFF',
            fontSize: 20,
            textAlign: 'center',
            marginBottom: 10,
        },
        card: {
            backgroundColor: '#1E1E1E',
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
            color: '#AAAAAA',
            fontSize: 16,
            fontWeight: 'bold',
            marginTop: 8,
        },
        value: {
            color: '#FFFFFF',
            fontSize: 18,
            marginBottom: 12,
            backgroundColor: '#2E2E2E',
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
    });

    return (
        <View style={styles.container}>
            <Menu navigation = {navigation} back = {true} />
            {
                page === 'posts'? <Post id = {id} postId = {postId} styles = {styles}/> :
                page === 'proposals'? <Proposals id = {id} postId = {postId} styles = {styles}/> :
                page === 'emergency'? <Emergency id = {id} postId = {postId} styles = {styles}/> : null
            }
        </View>
    )
}

export default Info;

const Post = (props) => {

    const { user } = useAuth();
    const styles = props.styles;

    const [ like, setLike ] = useState(0);
    const [ deviceId, setDeviceId ] = useState(null);
    const [ post, setPost ] = useState(null);
    const [ lcount, setlCount ] = useState(0);
    const [ dcount, setdCount ] = useState(0);

    useEffect(() => {
        if(user) 
            setDeviceId(user.photoURL);
    }, [user]);

    useEffect(() => {
        // console.log('Device ID:', deviceId);
        const fetchPost = async () => {
            try {
                if(!deviceId) return;
                const res = await get(ref(database, `${deviceId}/profile/pincode`));
                const pincode = res.val();
                const resp = await get(ref(database, `communities/${pincode}/${props.id}/posts/${props.postId}`))
                setPost(resp.val());
                setlCount(resp.val().likes.count ?? 0);
                setdCount(resp.val().dislikes.count ?? 0);
                if(resp.val().likes[deviceId] !== null && resp.val().likes[deviceId] === 1) {
                    setLike(1);
                }else if(resp.val().dislikes[deviceId] === 1) 
                    setLike(-1);
                // console.log('Post:', resp.val());
            } catch (error) {
                console.log('Error fetching post:', error);
            }
        };
        fetchPost();
    }, [deviceId]);

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
                                backgroundColor: '#2E2E2E',
                            }}
                            onPress={() => toggleLike('like')}
                        >
                            <AntDesign 
                                name={like === 1 ? "like1" : "like2"} 
                                size={24} 
                                color={like === 1 ? "#00FF00" : "#FFFFFF"} 
                            />
                        </TouchableOpacity>
                        <Text style={{ color: '#FFFFFF', fontSize: 16, marginTop: 6 }}>
                            {lcount??  0}
                        </Text>
                    </View>

                    {/* Dislike */}
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity 
                            style={{
                                padding: 10,
                                borderRadius: 12,
                                backgroundColor: '#2E2E2E',
                            }}
                            onPress={() => toggleLike('dislike')}
                        >
                            <AntDesign 
                                name={like === -1 ? "dislike1" : "dislike2"} 
                                size={24} 
                                color={like === -1 ? "#FF0000" : "#FFFFFF"} 
                            />
                        </TouchableOpacity>
                        <Text style={{ color: '#FFFFFF', fontSize: 16, marginTop: 6 }}>
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
        </View>
    )
}

const Proposals = (props) => {
    const styles = props.styles;
    const { user } = useAuth();

    const [proposal, setProposal] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [selected, setSelected] = useState(null);
    const [pincode, setPincode] = useState(null);

    useEffect(() => {
        if (user) setDeviceId(user.photoURL);
    }, [user]);

    useEffect(() => {
        const fetchProposal = async () => {
            if (!deviceId) return;
            const pinRes = await get(ref(database, `${deviceId}/profile/pincode`));
            const pin = pinRes.val();
            setPincode(pin);

            const proposalRef = ref(database, `communities/${pin}/${props.id}/proposals/${props.postId}`);
            onValue(proposalRef, (snapshot) => {
                const data = snapshot.val();
                setProposal(data);
                if (data?.votes?.[deviceId] !== undefined) {
                    setSelected(data.votes[deviceId]);
                }
            });
        };
        fetchProposal();
    }, [deviceId]);

    const handleVote = async (index) => {
        if (selected === index || !deviceId || !pincode) return;
    
        const path = `communities/${pincode}/${props.id}/proposals/${props.postId}`;
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
                    console.log(index);
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
                                backgroundColor: selected === index ? '#4CAF50' : '#2E2E2E',
                                borderColor: isWinner ? '#FFD700' : '#555',
                                borderWidth: 2,
                            }}
                        >
                            <Text style={{ color: '#FFF', fontSize: 16 }}>
                                {value} - {count} vote{count !== 1 ? 's' : ''} {isWinner ? '🏆' : ''}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
        </View>
    );
};

const Emergency = (props) => {

    const styles = props.styles;
    const [ proposal, setProposal ] = useState(null);
    const [ deviceId, setDeviceId ] = useState(null);   
    const { user } = useAuth();

    useEffect(() => {
        if(user) 
            setDeviceId(user.photoURL);
    }, [user]);

    useEffect(() => {
        const fetchProposal = async () => {
            try {
                if(!deviceId) return;
                const res = await get(ref(database, `${deviceId}/profile/pincode`));
                const pincode = res.val();
                const resp = await get(ref(database, `communities/${pincode}/${props.id}/emergency/${props.postId}`))
                setProposal(resp.val());
            } catch (error) {
                console.log('Error fetching proposal:', error);
            }
        }
        fetchProposal();
    }, [deviceId]);

    return (
        <View style={styles.card}>
            <Text style = {styles.h1}>Proposals</Text>
            <View style = {styles.secCard}>
                <Text style = {styles.label}>Title: </Text>
                <Text style = {styles.value}>{proposal ? proposal.title: null}</Text>
            </View>
            <View style = {styles.secCard}>
                <Text style = {styles.label}>Description: </Text>
                <Text style = {styles.value}>{proposal ? proposal.desc: null}</Text>
            </View>
        </View>
    )
}