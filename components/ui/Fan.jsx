import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Button, Pressable, TouchableOpacity, Easing, TextInput } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {MotiView ,  MotiText} from 'moti';
import AntDesign from '@expo/vector-icons/AntDesign';

const Fan = (props) => {

  const speed = 1 / props.speed;
  const theme = props.theme;
  const { height, width } = Dimensions.get("window");
  const isPortrait = height > width;
  const [ name, setName ] = useState(props.name);
  
  const screenWidth = isPortrait ? width * 0.35 : width * 0.15;

const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.background,
      borderRadius: screenWidth / 10,
      height: screenWidth,
      width: screenWidth,
      padding: screenWidth * 0.05,
      margin: screenWidth * 0.02,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      elevation: 5,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'space-evenly',
      borderWidth: 1,
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
      fontWeight: "bold",
      color: theme.text,
    },
    cardValue: {
      fontSize: screenWidth * 0.08,
      color: theme.primary,
    },
    speedCont: {
      flexDirection: 'row',
      alignItems: 'center',
      width: screenWidth * 0.8,
      justifyContent: 'space-between',
    },
    speedBox: {
      borderWidth: 1,
      borderColor: 'white',
      height: screenWidth * 0.2,
      width: screenWidth * 0.2,
      alignItems: 'center',
      justifyContent: 'center',
    }
});

  useEffect(() => {
    props.setChanges( (prev) => {
      return { ...prev, [props.id + 1]: name };
    } )
  }, [name]);

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
            <MotiView
              from={{ rotate: '0deg' }}
              animate={props.state ? { rotate: '999999999deg' } : { rotate: '0deg' }}
              transition={{ 
                type: 'timing' , 
                duration: speed * 10000000000, 
                loop: true, 
                easing: Easing.linear
              }}
              style={{ transform: [{ rotate: '0deg' }] }} 
            >
              <MaterialCommunityIcons name="fan" size={screenWidth * 0.25} color={theme.text} />
            </MotiView>
            <View style={styles.speedCont}>
              <Pressable
                onPress={ () => {
                  if(props.speed > 0)
                    props.decrease(props.name)
                }}
              >
                <AntDesign name="minussquareo" size={screenWidth * 0.2} color={theme.text} />
              </Pressable>
              <View style={styles.speedBox}>
                <Text style={styles.cardValue}>{ props.speed }</Text>
              </View>
              <Pressable
                onPress={ () => {
                  if(props.speed < props.max)
                    props.increase(props.name)
                }}
              >
                <AntDesign name="plussquareo" size={screenWidth * 0.2} color={theme.text} />
              </Pressable>
            </View>
          </Pressable>
    )
}

export default Fan;