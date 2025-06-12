import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Button, Pressable, TouchableOpacity, TextInput } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {MotiView,  MotiText} from 'moti';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Easing } from 'react-native-reanimated';

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
      borderRadius: 25,
      height: screenWidth ,
      width: screenWidth,
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
      borderRadius: screenWidth * 0.05,
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
            onPress={() => { if (!props.edit) props.toggle(props.name) }}
            onLongPress={() => props.setEdit(true)}
          >
            {
                props.edit ? (
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={(text) => {setName(text); props.change(true)}}
                  />
                ):(
                  <Text style={styles.cardTitle}>{name}</Text>
                )
              }
              <MotiView
                key={props.state + '-' + props.speed}
                from={{ rotate: '0deg' }}
                animate={props.state ? { rotate: '360deg' } : { rotate: '0deg' }}
                transition={{ 
                  type: 'timing', 
                  duration: speed * 1000, 
                  loop: props.state? true: false, 
                  repeatReverse: false,
                  easing: Easing.linear

                }}
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

function areEqual(prevProps, nextProps) {
  return (
    prevProps.state === nextProps.state &&
    prevProps.speed === nextProps.speed &&
    prevProps.name === nextProps.name &&
    prevProps.edit === nextProps.edit &&
    prevProps.theme === nextProps.theme
  );
}

// export default Fan;
export default React.memo(Fan, areEqual);