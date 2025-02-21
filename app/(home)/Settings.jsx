import React from 'react';
import { Button, Text } from 'react-native';

function Settings({navigation}) {
    return (
        <Text> Settings <Button title='click me' onPress={ () => {navigation.navigate('room/12')}}/></Text>
    )
}

export default Settings;