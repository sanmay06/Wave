import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const Light = (props) => {

    const theme = props.theme;

    const styles = StyleSheet.create({
        card: {
          backgroundColor: theme.background,
          borderRadius: 25,
          padding: 20,
          marginBottom: 15,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          elevation: 5,
          borderColor: theme.border,
          borderWidth: 1,
        },
        cardTitle: {
          fontSize: 18,
          marginBottom: 10,
          fontWeight: "bold",
          color: theme.text,
        },
        cardValue: {
          fontSize: 24,
          color: theme.primary,
        },
      });

    return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{props.name}</Text>
          <Switch
            value={props.light}
            onValueChange={(value) => {
              props.setLight(value);
              props.toggleLight(props.name, value);
            }}
          />
        </View>
    )
}

export default Light;