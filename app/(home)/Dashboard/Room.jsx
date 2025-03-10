import React from 'react'
import { Text } from 'react-native'
import Light from '@/components/ui/Lights'
import { RouteProp } from '@react-navigation/native';


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

    return (
        <Text>Room {id}</Text>
    )
} 

export default Room;