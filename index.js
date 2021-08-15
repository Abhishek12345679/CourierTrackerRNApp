/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import PushNotification, {Importance} from 'react-native-push-notification';

PushNotification.configure({
  onRegister: function (token) {
    // console.log('TOKEN:', token);
  },
  onNotification: function (notification) {
    // console.log('NOTIFICATION:', notification);
  },
  popInitialNotification: true,
  requestPermissions: true,
});

PushNotification.createChannel(
  {
    channelId: 'reminder_channel', // (required)
    channelName: 'reminders', // (required)
    channelDescription: 'A channel to handle the reminders', // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

AppRegistry.registerComponent(appName, () => App);
