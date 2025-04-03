import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Button, Pressable, TouchableOpacity, TextInput } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Outlet = (props) => {

    const theme = props.theme;

    const [color, setColor ] = useState(theme.text);
    
    const { height, width } = Dimensions.get("window");
    const isPortrait = height > width;
    const [ name, setName ] = useState(props.name);

    
    const screenWidth = isPortrait ? width * 0.35 : width * 0.15;

    const styles = StyleSheet.create({
        card: {
          backgroundColor: theme.background,
          borderRadius: 25,
          height: screenWidth ,
          width: screenWidth ,
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
        input: {
          fontSize: screenWidth * 0.1,
          fontWeight: "bold",
          width: screenWidth * 0.8,
          color: theme.text,
          textAlign: "center",
          borderWidth: 1,
          borderColor: 'white',
        },
        cardTitle: {
          fontSize: screenWidth * 0.1,
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
        props.setChanges( (prev) => {
          return { ...prev, [props.id + 1]: name };
        } )
      }, [name]);

      useEffect(() => {
        setColor(props.state ? 'black': theme.text);
      }, [props.state]);

    return (
          <Pressable
            style={styles.card}
            onPress={() => props.toggle(props.name) }
            onLongPress={() => props.setEdit(true)}
          >
             {
              props.edit ? (
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={(text) => setName(text)}
                />
              ):(
                <Text style={styles.cardTitle}>{name}</Text>
              )
            }
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