import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { ThemeContext } from "@/hooks/ThemeProvider";
import useAuth from "@/hooks/Auth";
import { database } from "@/firebaseConfig";
import { get, query, ref, set, orderByChild, startAt, endAt, remove } from "firebase/database";
import Menu from "@/components/ui/Menu";
import { useRoute } from "@react-navigation/native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const Community = ({ navigation }) => {

    // const { user } = useAuth();
    const route = useRoute();
    const { user } = useAuth();
    const { theme } = useContext(ThemeContext);
    const deviceId = route.params.deviceID;
    const [ userId, setUserId ] = useState("");
    const [ community, setCommunity ] = useState();

    useEffect(() => {
        setUserId(user?.uid);
    }, [user]);

    useEffect(() => {
        if(deviceId) {
            const getCommunity = async  () => {
                try {
                    if(!userId) return;
                    const response = await get(ref(database, `${deviceId}/community`));
                    if(response.exists()){
                        const comm = response.val();
                        console.log("Community ID:", comm);
                        const resp = await get(ref(database, `communities/${comm}/members`));
                        if(resp.exists()) {
                            const members = resp.val();
                            console.log("Members:", members);
                            if(members[userId])
                                setCommunity(response.val());
                        }
                    }
                }catch (error) {
                    console.error("Error fetching community data:", error);
                }
            }
            getCommunity();
        }
    }, [deviceId, userId]);

    const { height, width } = Dimensions.get("window");
    const isPortrait = height > width; 
    const screenWidth = isPortrait ? width * 0.35 : width * 0.15;
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            padding: 20,
          },
        title: {
            fontSize: screenWidth * 0.1,
            fontWeight: "bold",
            color: theme.text,
            textAlign: "center",
        }, 
        description: {
            fontSize: screenWidth * 0.05,
            color: theme.text,
            textAlign: "center",
            marginVertical: 10,
        },
        button: {
            backgroundColor: theme.primary,
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
            marginTop: 20,
        },
        buttonText: {
            color: theme.text,
            fontSize: screenWidth * 0.05,
            fontWeight: "bold",
        },
});
            

    return (
        <View style={styles.container}>
            <Menu navigation={navigation} />
            <View style = {{display: 'flex',marginTop: 12, height:50 , flexDirection: "row", alignItems: 'center', verticalAlign: 'center', width: '95%', justifyContent: 'space-between', backgroundColor: theme.menuBackground}}>
                <Text style={styles.title}>Communities</Text>
                <TouchableOpacity onPress={async() => {
                    await set(ref(database, `${deviceId}/community`), "");
                    if(!userId || !community) return;
                    const resp = await get(ref(database, `communities/${community}/members`));
                    if(resp.exists()) {
                        const memeber = resp.val();
                        const count = Object.keys(memeber).length;
                        
                        if(count == 1 && memeber[userId]) {
                            await remove(ref(database, `communities/${community}`));
                            console.log("Community deleted as it had only one member", community);
                        }
                        await remove(ref(database, `communities/${community}/members/${userId}`));
                    }
                    setCommunity("");
                }}>
                    <MaterialIcons name="exit-to-app" size={32} color={theme.text} />
                </TouchableOpacity>
            </View>
            {community ? <CommMenu nav={navigation} community = {community} theme = {theme} deviceID = {deviceId}/>: <Communities navigation = {navigation} setComm = {setCommunity} devId = {deviceId}/>}
        </View>
    );
};

export default Community;

const CommMenu = (props) => {
    
    const theme = props.theme;
    // console.log("community:", props.community);
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.background,
          padding: 20,
          alignItems: 'center',
          justifyContent: 'space-around',
          width: '100%',
        },
        header: {
          fontSize: 24,
          fontWeight: 'bold',
          color: theme.text,
          textAlign: 'center',
          marginBottom: 30,
        },
        menuItem: {
          fontSize: 18,
          color: theme.text,
          textAlign: 'center',
          paddingVertical: 12,
          marginVertical: 8,
        },
        card: {
            borderColor: theme.text,
            borderWidth: 1,
            borderRadius: 10,
            width: '80%',
            alignItems: 'center',
            justifyContent: 'center',
        }
      });
    
      return (
        <View style={styles.container}>
          {/* <Text style={styles.header}>Community Menu</Text> */}
    
          <TouchableOpacity style={styles.card} onPress={ () => props.nav.navigate("community/[page]", { id: props.community, page: "posts", deviceID : props.deviceID })}>
            <Text style={styles.menuItem}>Community Posts</Text>
          </TouchableOpacity>
    
          <TouchableOpacity style={styles.card} onPress={ () => props.nav.navigate("community/[page]", { id: props.community, page: "proposals", deviceID : props.deviceID })}>
            <Text style={styles.menuItem}>Community Proposals</Text>
          </TouchableOpacity>
    
          <TouchableOpacity style={styles.card} onPress={ () => props.nav.navigate("community/[page]", { id: props.community, page: "emergency",deviceID : props.deviceID })}>
            <Text style={styles.menuItem}>Emergency Pings</Text>
          </TouchableOpacity>
        </View>
      );
    };

const Communities = ( props ) => {
    const navigation = props.navigation;
    const [ communities, setCommunity ] = useState();
    const { user } = useAuth();
    const { theme } = useContext(ThemeContext);
    const [ pin, setPin ] = useState("");
    const { height, width } = Dimensions.get("window");
    const isPortrait = height > width; 
    const screenWidth = isPortrait ? width * 0.35 : width * 0.15;
    const deviceId = props.devId;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            padding: 20,
          },
        title: {
            fontSize: screenWidth * 0.1,
            fontWeight: "bold",
            color: theme.text,
            textAlign: "center",
        }, 
        description: {
            fontSize: screenWidth * 0.05,
            color: theme.text,
            textAlign: "center",
            marginVertical: 10,
        },
        button: {
            backgroundColor: theme.primary,
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
            marginTop: 20,
        },
        buttonText: {
            color: theme.text,
            fontSize: screenWidth * 0.05,
            fontWeight: "bold",
        },
        card: {
            borderColor: theme.text,
            borderWidth: 1,
            borderRadius: 10,
            width: '80%',
            alignItems: 'center',
            justifyContent: 'center',
        }
    });

    const getBoundaries = async() => {
        try {
            const res = await get(ref(database, `${deviceId}/profile`));
            // console.log("res:", res.val());
            const latitude = res.val().latitude;
            const longitude = res.val().longitude;

            const delta = 1 / 111.32;

            const result = {
                minLat: latitude - delta,
                maxLat: latitude + delta,
                minLong: longitude - delta,
                maxLong: longitude + delta,
            };
            
            // console.log("Boundaries:", result);
            return result;
        }catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function getCommunity() {
            try {
                const {  minLat, maxLat, minLong, maxLong } = await getBoundaries();
                const q = query(
                    ref(database, 'communities'),
                    orderByChild('location/latitude'),
                    startAt(minLat),
                    endAt(maxLat)
                );

                await get(q).then( (snapshot) => {
                    if(snapshot.exists()) {
                        const results = Object.entries(snapshot.val())
                            .map( ([key, obj]) => ({
                                id: key,
                                ...obj,
                            }))
                            .filter((item) => 
                                item.location.longitude >= minLong &&
                                item.location.longitude <= maxLong
                            );

                        setCommunity(results);
                        // console.log("Communities in range:", results);
                    }
                });
            }catch (error) {
                console.log(error);
            }
        }
        getCommunity()
    }, []);

    const joining = async (communityId, type) => {
        try {
            set(ref(database, `${deviceId}/community`), communityId);
            console.log("Community joined:", communityId);
            set(ref(database, `communities/${pin}/${communityId}/members/${user.uid}`), {
                joinedAt: new Date().toString()
            })
            props.setComm(communityId);
        } catch (error) {
            console.log("Error joining community:", error);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Community</Text>
            <Text style={styles.description}>Join our community and connect with others!</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('create', { deviceID: deviceId })}>
                <Text style={styles.buttonText}>Want to create a community?</Text>
            </TouchableOpacity>
            <Text style={styles.description}>Communities</Text>
            <View style={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
            {communities && communities.length > 0 ? (
                communities.map((community, index) => (
                    <View key={index} style={styles.card}>
                    <Text style={styles.description}>{community.name}</Text>
                    <Text style={styles.description}>{community.description}</Text>
                    <TouchableOpacity
                        onPress={() => joining(community.id)}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Join</Text>
                    </TouchableOpacity>
                    </View>
                ))
                ) : (
                <Text style={styles.description}>
                    No communities available in your area. Try creating one.
                </Text>
            )}
            </View>
        </ScrollView>
    )

}