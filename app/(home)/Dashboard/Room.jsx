import React, { useContext, useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import Light from '@/components/ui/Lights';
import { RouteProp } from '@react-navigation/native';
import { database } from '@/firebaseConfig';
import { ref, get, set, update } from 'firebase/database';
import { ThemeContext } from '@/hooks/ThemeProvider';
import Menu from '@/components/ui/Menu';
import Fan from '@/components/ui/Fan';
import Outlet from '@/components/ui/Outlets';
import useAuth from '@/hooks/Auth';

function Room({navigation , route}) {

    const { theme } = useContext(ThemeContext);

    const { id } = route.params;

    const [lights, setLights] = useState(null);
    const [ data, setData ] = useState();
    const [ deviceId, setDeviceId ] = useState();
    const [ fans, setFans ] = useState(null);
    const [ outlets, setOutlets ] = useState(null);
    
    const { user } = useAuth(); 
    useEffect(() => {
        if(user) {
            setDeviceId(user.photoURL);
        }
    }, [user]);
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
        console.log("Device ID:", deviceId);
    }, [deviceId]);

    useEffect(() => {
        console.log("Data: ", data);
    }, [data]);

    useEffect(() => {
        if(data) {
            if(data.lights) {
                let length = Object.values(data.lights).length;
                let arr = [];
                for(let i = 1; i <= length; i++) {
                    // console.log(data.lights['light' + i]);
                    arr.push(data.lights['light' + i]);
                }
                setLights(arr);
            }
            if(data.fans) {
                let length = Object.values(data.fans).length;
                let a = [];
                for(let i = 1; i <= length; i++) {
                    a.push(data.fans['fan' + i]);
                }
                setFans(a);
            }
            if(data.outlets) {
                let length = Object.values(data.outlets).length;
                let a = [];
                for(let i = 1; i <= length; i++) {
                    a.push(data.outlets['outlet' + i]);
                }
                setOutlets(a);
            }
            // console.log('fans:', a);            
            // console.log(arr);
        }
    }, [data]);

    const toggleLight = (name) => {
        setLights(prev =>
            prev.map(light =>
                light.name === name ? { ...light, state: !light.state } : light
            )
        );
    };

    const toggleOutlet = (name) => {
        setOutlets(prev =>
            prev.map(outlet =>
                outlet.name === name ? { ...outlet, state: !outlet.state } : outlet
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
            if(!outlets)
                return;
            // console.log("lights:", lights)
            let t = 1;
            const obj = outlets.reduce((acc, outlet) => {
                acc['outlet' + (t++)] = outlet
                // console.log(acc);
                return acc;
            },{});

            // console.log("Object:",obj)

            await update(ref(database, `${deviceId}/rooms/room${id}/outlets`), obj).then(
                console.log('updated outlets')
            )
        } 
        updateData();
    }, [outlets]);

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
            <View style = {styles.componentBox}>
                <Text style={styles.compText}>Outlets</Text>
                <View style = {{flexDirection: 'row'}}>
                    {outlets && outlets.map((outlet, id) => <Outlet key={id} theme={theme} name={outlet.name} state={outlet.state} toggle={toggleOutlet}/>)}
                </View>
            </View>
        </View>
    )
} 

export default Room;