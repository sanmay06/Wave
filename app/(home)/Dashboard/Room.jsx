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
    const [ fans, setFans ] = useState([]);

    const toggleLight = (name) => {
        setLights(prev =>
            prev.map(light =>
                light.name === name ? { ...light, state: !light.state } : light
            )
        );
    };
    
    const toggleFans = (name) => {
        setFans(prev =>
            prev.map(fan =>
                fan.name === name ? { ...fan, state: !fan.state } : fan
            )
        );
    };  

    const increase = (name) => {
        setFans( prev => 
            prev.map( fan => 
                fan.name === name ? {...fan, speed: fan.speed + 1} : fan
            )
        )
    }

    const decrease = (name) => {
        setFans( prev => 
            prev.map( fan => 
                fan.name === name ? {...fan, speed: fan.speed - 1} : fan
            )
        )
    }

    useEffect(() => {
        async function updateData(){
            if(!lights)
                return;
            // console.log("lights:", lights)
            let t = 1;
            const obj = lights.reduce((acc, light) => {
                acc['light' + (t++)] = light
                // console.log(acc);
                return acc;
            },{});

            // console.log("Object:",obj)

            await update(ref(database, `${deviceId}/rooms/room${id}/lights`), obj).then(
                console.log('updated Lights')
            )
        } 
        updateData();
    }, [lights]);

    useEffect(() => {
        async function updateData(){
            if(!fans)
                return;
            // console.log("fans:", fans)
            let t = 1;
            const obj = fans.reduce((acc, fan) => {
                acc['fan' + (t++)] = fan
                // console.log(acc);
                return acc;
            },{});

            // console.log("Object:",obj)

            await update(ref(database, `${deviceId}/rooms/room${id}/fans`), obj).then(
                console.log('updated Fans')
            )
        }
        updateData();
    }, [fans]);

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
        // console.log("Data:",data);
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
            length = Object.values(data.fans).length;
            let a = [];
            for(let i = 1; i <= length; i++) {
                a.push(data.fans['fan' + i]);
            }
            setFans(a);
            // console.log('fans:', a);            
            // console.log(arr);
        }
    }, [data]);

    async function name() {
        try {

            await update(ref(database, `/ef16bute/rooms/room1`), {
                fans: {
                    fan1: {
                        name: "Fan 1",
                        state: true,
                        speed: 5,
                        max: 5
                    },
                    fan2: {
                        name: "Fan 2",
                        state: false,
                        speed: 4,
                        max: 5
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
            minHeight: '100%',
            backgroundColor: theme.background,
            justifyContent: 'center',
        },
        componentBox: {
            flex: 1,
            flexDirection: 'column',
        },
        compText: {
            width: '100% ',
            fontSize: 20,
            color: theme.text,
            backgroundColor: theme.primary
        }
    })

    return (
        <View style={styles.container}>
            <Menu back={true} navigation={navigation} />
            {/* <Button onPress={name} title='Do not push me'></Button> */}
            <View style = {styles.componentBox}>
                <Text style={styles.compText}>Lights</Text>
                <View style = {{flexDirection: 'row'}}>
                    {lights && lights.map((light, id) => <Light key={id} theme={theme} name={light.name} light={light.state} toggleLight={toggleLight}/>)}
                </View>
            </View>
            <View style = {styles.componentBox}>
                <Text style={styles.compText}>Fans</Text>
                <View style = {{flexDirection: 'row'}}>
                    {fans && fans.map((fan, id) => <Fan key={id} theme={theme} name={fan.name} state={fan.state} toggle={toggleFans} max = {fan.max} speed = {fan.speed} increase={increase} decrease={decrease}/>)}
                </View>
            </View>
        </View>
    )
} 

export default Room;