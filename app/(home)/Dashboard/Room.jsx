import React from 'react'
import { Text, View, Button } from 'react-native'
import Light from '@/components/ui/Lights'
import { RouteProp } from '@react-navigation/native';
import { database } from '@/firebaseConfig';
import { ref, get, set, update } from 'firebase/database';


function Room({navigation , route}) {

    const { id } = route.params;

    const [lights, setLights] = React.useState([]);

    const toggleLight = (name) => {
        if(lights.includes(name)) {
            setLights(lights.filter(light => light !== name));
        }
        else {
            setLights([...lights, name]);
        }
    }

    const checkLight = (name) => {
        return lights.includes(name);
    }

    async function name() {
        try {

            await update(ref(database, `/`), {
                testid:{
                    profile:{
                        uname:'test',
                        email:''
                    }
                }
            });

            const snap = await get(ref(database, `/`));
            console.log(snap.val());
            
        } catch (error) {
            console.error("Registration error:", error.message);
            return error.message;
        }
    }

    return (
        <View>
            <Button onPress={name}>Add</Button>
            <Text>Room {id}</Text>
        </View>
    )
} 

export default Room;