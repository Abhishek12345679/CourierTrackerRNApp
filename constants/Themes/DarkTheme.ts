import {DarkTheme as SystemDarkTheme} from '@react-navigation/native';

export const DarkTheme = {
  ...SystemDarkTheme,
  colors: {
    ...SystemDarkTheme.colors,
    primary: '#FFF',
    background: '#121212',
    text: '#fff',
    card: '#212529',
  },
};
