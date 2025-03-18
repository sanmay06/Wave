import React, { useContext, useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import Light from '@/components/ui/Lights';
import { RouteProp } from '@react-navigation/native';
import { database } from '@/firebaseConfig';
import { ref, get, set, update } from 'firebase/database';
import { ThemeContext } from '@/hooks/ThemeProvider';
import Menu from '@/components/ui/Menu';

function Room({navigation , route}) {

    const { theme } = useContext(ThemeContext);

    const { id } = route.params;

    const [lights, setLights] = useState([]);
    const [ data, setData ] = useState();
    const [ deviceId, setDeviceId ] = useState('ef16bute');

    const toggleLight = (name) => {
        setLights(prev =>
            prev.map(light =>
                light.name === name ? { ...light, state: !light.state } : light
            )
        );
    };
    

    async function getData() {
        try {
            let data = await get(ref(database, `${deviceId}/rooms/room${id}`));
            setData(data.val());
        }catch(error) {
            console.log("Error occurred:" + error.message);
        }
    }

    useEffect(() => {
        getData();
        console.log(data);
    }, []);

    useEffect(() => {
        if(data) {
            let length = Object.values(data.lights).length;
            let arr = [];
            for(let i = 1; i <= length; i++) {
                console.log(data.lights['light' + i]);
                arr.push(data.lights['light' + i]);
            }
            setLights(arr);
            console.log(arr);
        }
    }, [data]);

    async function name() {
        try {

            await update(ref(database, `/ef16bute/rooms/room1/lights`), {
                    light1: {
                        name: "Light1",
                        state: true
                    },
                    light2: {
                        name: "Light2",
                        state: false
                    }
            });

            const snap = await get(ref(database, `/ef16bute/rooms/room1/lights`));
            console.log(snap.val());
            
        } catch (error) {
            console.error("Registration error:", error.message);
        }
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        }
    })

    return (
        <View style={styles.container}>
            <Menu back={true} navigation={navigation} />
            <Button onPress={name} title='Do not push me'></Button>
            <Text>Room {id}</Text>
            <View>
                <Text>Lights</Text>
                {lights && lights.map((light) => <Light theme={theme} name={light.name} light={light.state} toggleLight={toggleLight}/>)}
            </View>
        </View>
    )
} 

export default Room;