import React from 'react'
import { Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

function Room({navigation}) {

    const { id } = useLocalSearchParams()

    return (
        <Text>Room {id}</Text>
    )
} 

export default Room;