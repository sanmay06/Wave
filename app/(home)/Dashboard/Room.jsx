import React, { useContext, useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable } from 'react-native';
import Light from '@/components/ui/Lights';
import { database } from '@/firebaseConfig';
import { ref, get, update, set } from 'firebase/database';
import { ThemeContext } from '@/hooks/ThemeProvider';
import Menu from '@/components/ui/Menu';
import Fan from '@/components/ui/Fan';
import Outlet from '@/components/ui/Outlets';
import useAuth from '@/hooks/Auth';
import { MotiView } from 'moti';

function Room({navigation , route}) {

    const { theme } = useContext(ThemeContext);

    const { id } = route.params;

    const [lights, setLights] = useState(null);
    const [ data, setData ] = useState();
    const [ deviceId, setDeviceId ] = useState();
    const [ fans, setFans ] = useState(null);
    const [ outlets, setOutlets ] = useState(null);
    const [ edit, setEdit ] = useState(false);
    const [ lc, setLc ] = useState({});
    const [ fc, setFc ] = useState({});
    const [ oc, setOc ] = useState({});
    const [ name, setName ] = useState('');
    const [ changes, setChange ] = useState(false);
    
    const { user } = useAuth();     

    const setChanges = () => {
        setEdit(false);
        if(lc) {
            for(const [key, value] of Object.entries(lc))
                changeName('lights', id, value, key, 'light');
        }
        if(fc) {
            for(const [key, value] of Object.entries(fc))
                changeName('fans', id, value, key, 'fan');
        }
        if(oc) {
            for(const [key, value] of Object.entries(oc))
                changeName('outlets', id, value, key, 'outlet');
        }
    };
    
    const changeName = async (type, id, name, key, id2) => {
        try {
            set(ref(database, `${deviceId}/rooms/room${id}/${type}/${id2}${key}/name`), name);
        }catch(error) {
            console.log("Error :", error.message);
        }
    }

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
    }, [deviceId]);

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
                // console.log(lights);
            }
            if(data.fans) {
                let length = Object.values(data.fans).length;
                let a = [];
                for(let i = 1; i <= length; i++) {
                    a.push(data.fans['fan' + i]);
                }
                setFans(a);
                // console.log(fans);
            }
            if(data.outlets) {
                let length = Object.values(data.outlets).length;
                let a = [];
                for(let i = 1; i <= length; i++) {
                    a.push(data.outlets['outlet' + i]);
                }
                setOutlets(a);
                console.log(outlets);
            }
            if(data.name) {
                setName(data.name);
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
        console.log("Lights:", lc);
    }, [lc]);

    useEffect(() => {
        console.log("Fans:", fc);
    }, [fc]);

    useEffect(() => {
        console.log("Outlets:", oc);
    }, [oc]);

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
            flex: 1,
            backgroundColor: theme.background,
        },
        componentBox: {
            flexGrow: 1,
            padding: 10,
            width: '100%',
        },
        compText: {
            fontSize: 20,
            color: theme.text,
            backgroundColor: 'grey',
            paddingVertical: 6,
            paddingHorizontal: 12,
            marginBottom: 8,
            borderRadius: 4,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.text,
            textAlign: 'center',
        }
    });


    return (
        <View style={styles.container}>
            <Menu back={true} navigation={navigation} />
            <ScrollView contentContainerStyle={styles.componentBox}>
                {/* {changes && <Pressable onPress={() => { setChanges(); setChange(false)}} style={{ marginBottom: 16 }} >
                    <Text style={{ color: theme.text, textAlign: 'center' }}>Save Changes</Text>
                </Pressable>} */}
                <Pressable onPress={() => edit && (setEdit(false), setChange())} style={{ marginBottom: 16 }} >
                    <Text style={styles.title}>Room: {name}</Text>
                    <View style={{ marginBottom: 24 }}>
                        <Text style={styles.compText}>Lights</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {lights && lights.map((light, id) => (
                                <MotiView
                                    from={{ opacity: 0, translateY: -50 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    transition={{ type: 'timing', duration: 300, delay: id * 100 }}
                                >
                                    <Light
                                        key={id}
                                        theme={theme}
                                        name={light.name}
                                        light={light.state}
                                        toggleLight={toggleLight}
                                        id={id}
                                        setChanges={setLc}
                                        edit={edit}
                                        setEdit={setEdit}
                                        change={setChange}
                                    />
                                </MotiView>
                            ))}
                        </View>
                    </View>

                    <View style={{ marginBottom: 24 }}>
                        <Text style={styles.compText}>Fans</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {fans && fans.map((fan, id) => (
                                <MotiView
                                    from={{ opacity: 0, translateY: -50 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    transition={{ type: 'timing', duration: 300, delay: id * 100 }}
                                >
                                    <Fan
                                        key={id}
                                        theme={theme}
                                        name={fan.name}
                                        state={fan.state}
                                        toggle={toggleFans}
                                        max={fan.max}
                                        speed={fan.speed}
                                        increase={increase}
                                        decrease={decrease}
                                        id={id}
                                        setChanges={setFc}
                                        edit={edit}
                                        setEdit={setEdit}
                                        change={setChange}
                                    />
                                </MotiView>
                            ))}
                        </View>
                    </View>

                    <View>
                        <Text style={styles.compText}>Outlets</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {outlets && outlets.map((outlet, id) => (
                                <MotiView
                                from={{ opacity: 0, translateY: -50 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ type: 'timing', duration: 300, delay: id * 100 }}
                            >
                                    <Outlet
                                        key={id}
                                        theme={theme}
                                        name={outlet.name}
                                        state={outlet.state}
                                        toggle={toggleOutlet}
                                        id={id}
                                        setChanges={setOc}
                                        edit={edit}
                                        setEdit={setEdit}
                                        change={setChange}
                                    />
                                </MotiView>
                            ))}
                        </View>
                    </View>
                </Pressable>
            </ScrollView>
        </View>
    );
}

export default Room;