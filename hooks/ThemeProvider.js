import {Appearance} from 'react-native';
import { React, useState, createContext } from 'react';
import { Colors } from '../constants/Colors';

export const ThemeContext = new createContext('light');

export const ThemeProvider = ({children}) => {

    const [ colorScheme, setcolorScheme ] = new useState(Appearance.getColorScheme());

    // const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const theme = Colors.light;

    return (  
        <ThemeContext.Provider value={{theme, colorScheme, setcolorScheme}}>
            {children}
        </ThemeContext.Provider>
    );

}