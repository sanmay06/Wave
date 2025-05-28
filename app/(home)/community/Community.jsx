import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Button, Pressable, TouchableOpacity, TextInput } from "react-native";
import { ThemeContext } from "@/hooks/ThemeProvider";
import useAuth from "@/hooks/Auth";
import { database } from "@/firebaseConfig";
import { get, ref, set } from "firebase/database";
import Menu from "@/components/ui/Menu";
import { useRoute } from "@react-navigation/native";

const Community = ({ navigation }) => {

    // const { user } = useAuth();
    const route = useRoute();

    const { theme } = useContext(ThemeContext);
    // const [ deviceId, setDeviceId ] = useState("");
    const deviceId = route.params.deviceID;

    const [ community, setCommunity ] = useState("");

    // useEffect(() => {
    //     if(user) {
    //         setDeviceId(user.photoURL);
    //     }
    // }, [user]);

    useEffect(() => {
        if(deviceId) {
            const getCommunity = async  () => {
                try {
                    const response = await get(ref(database, `${deviceId}/community`));
                    if(response.exists()){
                        setCommunity(response.val());
                    }
                }catch (error) {
                    console.error("Error fetching community data:", error);
                }
            }
            getCommunity();
        }
    }, [deviceId]);

    useEffect(() => {
        // if(community) 
        // navigation.navigate("community/[id]", { id: community });
    }, [community]);

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
            {community ? <CommMenu nav={navigation} community = {community} theme = {theme}/>: <Communities navigation = {navigation} setComm = {setCommunity}/>}
        </View>
    );
};

export default Community;

const CommMenu = (props) => {
    
    const theme = props.theme;
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
          <Text style={styles.header}>Community Menu</Text>
    
          <TouchableOpacity style={styles.card} onPress={ () => props.nav.navigate("community/[page]", { id: props.community, page: "posts" })}>
            <Text style={styles.menuItem}>Community Posts</Text>
          </TouchableOpacity>
    
          <TouchableOpacity style={styles.card} onPress={ () => props.nav.navigate("community/[page]", { id: props.community, page: "proposals" })}>
            <Text style={styles.menuItem}>Community Proposals</Text>
          </TouchableOpacity>
    
          <TouchableOpacity style={styles.card} onPress={ () => props.nav.navigate("community/[page]", { id: props.community, page: "emergency" })}>
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
    const [ deviceId, setDeviceId ] = useState();
    const [ pin, setPin ] = useState("");
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
        card: {
            borderColor: theme.text,
            borderWidth: 1,
            borderRadius: 10,
            width: '80%',
            alignItems: 'center',
            justifyContent: 'center',
        }
    });

    useEffect(() => {
        console.log("User:", user);
        if(user && user.photoURL) 
            setDeviceId(user.photoURL);
        // console.log(user.photoURL)
    }, [user]);

    useEffect(() => {
        async function getCommunity() {
            try {
                const res = await get(ref(database, `${deviceId}/profile/pincode`));
                console.log("res:", res.val());
                if(res.exists) {
                    const pincode = res.val();
                    setPin(pincode);
                    const response = await get(ref(database, `/communities/${pincode}`));
                    console.log("Response:", response.val());
                    if(response.exists()){
                        const comm = response.val();
                        console.log(response.val());
                        // if(comm != "")
                            setCommunity(comm);
                        // else
                        //     setCommunity(null);
                    }
                }
            }catch (error) {
                console.log(error);
            }
        }
        console.log("Device ID:", deviceId);
        if(deviceId) {
            getCommunity();
        }
    }, [deviceId]);

    const joining = async (communityId, type) => {
        try {
            if(type === "Anyone can join") {
                set(ref(database, `${deviceId}/community`), communityId);
                console.log("Community joined:", communityId);
                set(ref(database, `communities/${pin}/${communityId}/members/${user.uid}`), {
                    isAdmin: true,
                    joinedAt: new Date().toString()
                })
                props.setComm(communityId);
                // navigation.navigate("community/[id]", { id: communityId });
            }
            else {
                console.log("Requesting to join");
                set(ref(database, `communities/${pin}/${communityId}/requests/${user.uid}`), {
                    requestedAt: new Date().toString(),
                    name: user.displayName,
                    deviceId: deviceId,
                });
            }
        } catch (error) {
            console.log("Error joining community:", error);
        }
    }

    useEffect(() => {
        console.log('Communities:', communities);
    }, [communities]);

    return (
        <View style={styles.container}>
            <Menu navigation={props.navigation} />
            <Text style={styles.title}>Community</Text>
            <Text style={styles.description}>Join our community and connect with others!</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('create')}>
                <Text style={styles.buttonText}>Want to create a community?</Text>
            </TouchableOpacity>
            <Text style={styles.description}>Communities</Text>
            {/* {communities && communities.map((community, index) => (
                <View key={index} style={{ marginVertical: 10 }}>
                    <Text style={styles.description}>{community.name}</Text>
                    <Text style={styles.description}>{community.description}</Text>
                </View>
            ))} */}
            <View style={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
                { communities && Object.keys(communities).length > 0 ? (
                    Object.keys(communities).map((key, index) => (
                        <View key={index} style={styles.card} >
                            <Text style={styles.description}>{communities[key].name}</Text>
                            <Text style={styles.description}>{communities[key].description}</Text>
                            <TouchableOpacity onPress={ () => joining(key, communities[key].type)} style={styles.button}>
                                <Text style={styles.buttonText}>{communities[key].type === "Anyone can join"? "join": "ask to join?"}</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.description}>No communities available in ur area. Try creating one</Text>
                )}
            </View>
        </View>
    )

}