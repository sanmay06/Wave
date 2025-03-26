import React from 'react';
import { View, Text, StyleSheet, Dimensions, Button, Pressable, TouchableOpacity, Easing } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {MotiView ,  MotiText} from 'moti';
import AntDesign from '@expo/vector-icons/AntDesign';

const Fan = (props) => {

    const speed = 1 / props.speed;
    const theme = props.theme;
    const screeenWidth = Dimensions.get("window").width;
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
          elevation: props.light ? 10 : 5, 

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
        speedCont: {
          flexDirection: 'row',
          alignItems:'center',
          width: 100,
          justifyContent: 'space-evenly'
        },
        speedBox: {
          borderWidth: 1,
          borderColor: 'white',
          height: 22,
          width: 22,
          alignItems: 'center'
        }
      });

    return (
          <Pressable
            style={styles.card}
            onPress={() => props.toggle(props.name) }
          >
            <Text style={styles.cardTitle}>{props.name}</Text>
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
              <MaterialCommunityIcons name="fan" size={24} color={theme.text} />
            </MotiView>
            <View style={styles.speedCont}>
              <Pressable
                onPress={ () => {
                  if(props.speed > 0)
                    props.decrease(props.name)
                }}
              >
                <AntDesign name="minussquareo" size={24} color={theme.text} />
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
                <AntDesign name="plussquareo" size={24} color={theme.text} />
              </Pressable>
            </View>
          </Pressable>
    )
}

export default Fan;