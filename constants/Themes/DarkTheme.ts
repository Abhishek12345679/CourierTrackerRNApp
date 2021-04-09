import {DarkTheme as SystemDarkTheme} from '@react-navigation/native';

export const DarkTheme = {
  ...SystemDarkTheme,
  colors: {
    ...SystemDarkTheme.colors,
    primary: '#FFF',
    background: '#212529',
    text: '#fff',
    card: '#212529',
  },
};
