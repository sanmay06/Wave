import React, { useContext, useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import Light from '@/components/ui/Lights';
import { RouteProp } from '@react-navigation/native';
import { database } from '@/firebaseConfig';
import { ref, get, set, update } from 'firebase/database';
import { ThemeContext } from '@/hooks/ThemeProvider';
import Menu from '@/components/ui/Menu';
import Fan from '@/components/ui/Fan';

function Room({navigation , route}) {

    const { theme } = useContext(ThemeContext);

    const { id } = route.params;

    const [lights, setLights] = useState([]);
    const [ data, setData ] = useState();
    const [ deviceId, setDeviceId ] = useState('ef16bute');
    const [ speed, setSpeed ] = useState(2);

    const toggleLight = (name) => {
        setLights(prev =>
            prev.map(light =>
                light.name === name ? { ...light, state: !light.state } : light
            )
        );
    };    

    useEffect(() => {
        async function updateData(){
            if(!lights)
                return;
            console.log("lights:", lights)
            let t = 1;
            const obj = lights.reduce((acc, light) => {
                acc['light' + (t++)] = light
                // console.log(acc);
                return acc;
            },{});

            console.log("Object:",obj)

            await update(ref(database, `${deviceId}/rooms/room${id}/lights`), obj).then(
                console.log('updated')
            )
        } 
        updateData();
    }, [lights]);

    async function getData() {
        try {
            let data = await get(ref(database, `/${deviceId}/rooms/room${id}`));
            setData(data.val());
        }catch(error) {
            console.log("Error occurred:" + error.message);
        }
    }

    useEffect(() => {
        getData();
        console.log("Data:",data);
    }, []);

    useEffect(() => {
        if(data && data.lights) {
            let length = Object.values(data.lights).length;
            let arr = [];
            for(let i = 1; i <= length; i++) {
                // console.log(data.lights['light' + i]);
                arr.push(data.lights['light' + i]);
            }
            setLights(arr);
            // console.log(arr);
        }
    }, [data]);

    async function name() {
        try {

            await set(ref(database, `/ef16bute/rooms/room1`), {
                lights: {
                    light1: {
                        name: "Light1",
                        state: true
                    },
                    light2: {
                        name: "Light2",
                        state: false
                    }
                },
                name: 'kitchen'
            }).then(console.log('update'))

            const snap = await get(ref(database, `/ef16bute/rooms/`));
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
            {/* <Button onPress={name} title='Do not push me'></Button> */}
            <Text>Room {id}</Text>
            <View>
                <Text>Lights</Text>
                {lights && lights.map((light, id) => <Light key={id} theme={theme} name={light.name} light={light.state} toggleLight={toggleLight}/>)}
            </View>
            <Fan theme = {theme} toggle ={()=> console.log('toggling')} name ={'fan1'} state = {true} speed = {speed} setSpeed={setSpeed} max = {5}/>
        </View>
    )
} 

export default Room;