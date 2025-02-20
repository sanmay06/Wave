import { React, useContext } from 'react';
import { ThemeContext } from '@/hooks/ThemeProvider'
import { Pressable, StyleSheet, View } from 'react-native';
import { Octicons } from '@expo/vector-icons';
const ThemeButton = () => {
    const { theme, colorScheme, setcolorScheme  } = useContext(ThemeContext);

    const style = StyleSheet.create({
        button: {
            padding: 5,
            borderRadius: 25,
            width: 50,
            height: 50,
            alignItems: 'center',
            verticalAlign: 'center',
            verticalAlignItem: 'center',
            borderWidth: 1,
            borderColor: theme.text,
        },
        container: {
            alignItems: 'center',
            verticalAlign: 'center',
            verticalAlignItem: 'center',
        }
    })

    return (
        <View style={style.container}>
            <Pressable 
                onPress={() => {
                    setcolorScheme(colorScheme === 'dark' ? 'light' : 'dark');
                }}
                style={style.button}
            >
                {colorScheme === 'dark' ? 
                    <Octicons name = "moon" size={32} color={theme.text} />
                :
                    <Octicons name = "sun" size={32} color={theme.text} />
                }
            </Pressable>
        </View>
    )
}

export default ThemeButton;