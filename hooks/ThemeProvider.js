import {Appearance} from 'react-native';
import { React, useState, createContext } from 'react';
import { Colors } from '../constants/Colors';

// const Colors = {
//     light: {
//       text: '#11181C',
//       background: '#fff',
//     },
//     dark: {
//       text: '#ECEDEE',
//       background: '#151718',
//     },
//   };

export const ThemeContext = new createContext('light');

export const ThemeProvider = ({children}) => {

  const[ colorScheme, setcolorScheme ] = new useState(Appearance.getColorScheme());
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
    return (  
        <ThemeContext.Provider value={{theme, colorScheme, setcolorScheme}}>
            {children}
        </ThemeContext.Provider>
    )
}