import React from 'react';
import { View, Text } from 'react-native';

function CommPage({navigation, route}) {
    const {id} = route.params;
    console.log("Community ID:", id); // Log the community ID to verify it's being passed correctly
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Community Page</Text>
        </View>
    );
}

export default CommPage;