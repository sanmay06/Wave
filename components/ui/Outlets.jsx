import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Button, Pressable, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Outlet = (props) => {

    const theme = props.theme;
    const screeenWidth = Dimensions.get("window").width;

    const [color, setColor ] = useState(theme.text);

    const styles = StyleSheet.create({
        card: {
          backgroundColor: theme.background,
          borderRadius: 25,
          height: screeenWidth * 0.08,
          width: screeenWidth * 0.08,
          padding: 20,
          margin: 10,
          marginBottom: 15,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          elevation: 5,
          borderColor: theme.border,
          alignItems: 'center',
          justifyContent: 'space-evenly',
          borderWidth: 1,
          shadowColor: props.state ? "#FFD700" : "#000",
          shadowOpacity: props.state ? 0.8 : 0.3,
          shadowRadius: props.state ? 15 : 5,
          shadowOffset: { width: 0, height: 0 },
          elevation: props.state ? 10 : 5, 

        },
        cardTitle: {
          fontSize: 18,
          marginBottom: 10,
          fontWeight: "bold",
          color: theme.text,
        },
        cardValue: {
          color: theme.primary,
        },
        button: { 
          height: 40,
          width: 40,
          borderRadius: 20,
          backgroundColor: props.state ? "#FFD700" : theme.border,
          borderWidth: 3,
          borderColor: props.state ? "#FFD700" : theme.text,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: props.state ? "#FFD700" : "#000",
          shadowOpacity: props.state ? 0.8 : 0.3,
          shadowRadius: props.state ? 15 : 5,
          shadowOffset: { width: 0, height: 0 },
          elevation: props.state ? 10 : 5, 

        }
      });

      useEffect(() => {
        setColor(props.state ? 'black': theme.text);
      }, [props.state]);

    return (
          <Pressable
            style={styles.card}
            onPress={() => props.toggle(props.name) }
          >
            <Text style={styles.cardTitle}>{props.name}</Text>
            <Pressable
              style={styles.button}
              // value={props.light}
            >
              {props.state ? <MaterialCommunityIcons name="power-plug-outline" size={24} color={color} />:<MaterialCommunityIcons name="power-plug-off-outline" size={24} color={color} />}
              {/* <Text style={styles.cardValue}> {props.light ? "ON" : "OFF"} </Text> */}
            </Pressable>
          </Pressable>
    )
}

export default Outlet;