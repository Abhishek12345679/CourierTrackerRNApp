import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import {NotificationInfo} from '../../constants/Types/OrderTypes';
import store from '../store/store';

export const parseHexToInt = (uuid: string) => {
  var result = [];
  while (uuid.length >= 2) {
    result.push(parseInt(uuid.substring(0, 2), 16));
    uuid = uuid.substring(2, uuid.length);
  }
  return parseInt(result.join(''));
};

export const parseHexToString = (uuid: string) => {
  var result = [];
  while (uuid.length >= 2) {
    result.push(parseInt(uuid.substring(0, 2), 16));
    uuid = uuid.substring(2, uuid.length);
  }
  return result.join('');
};

const saveNotificationIdLocally = async (info: NotificationInfo) => {
  let notificationListString = await AsyncStorage.getItem('notificationList');
  let notificationList: NotificationInfo[] = [];
  if (notificationListString) {
    notificationList = JSON.parse(notificationListString) as NotificationInfo[];
  }
  notificationList.push(info);
  await AsyncStorage.setItem(
    'notificationList',
    JSON.stringify(notificationList),
  );
};

export const removeNotificationIdLocally = async (orderId: string) => {
  let notificationListString = await AsyncStorage.getItem('notificationList');
  if (notificationListString) {
    const notificationList = JSON.parse(
      notificationListString,
    ) as NotificationInfo[];

    notificationList.forEach((notification, index) => {
      if (notification.orderId === orderId) {
        PushNotification.cancelLocalNotifications({
          id: notification.notificationId.toString(),
        });
        notificationList.splice(index, 1);
      }
    });

    await AsyncStorage.setItem(
      'notificationList',
      JSON.stringify(notificationList),
    );
  }
};

export const callReminder = async (
  productImageUrl: string,
  notificationInfo: NotificationInfo,
  orderNumber: string,
  ETA: string,
  orderType: string,
  productName?: string,
) => {
  console.log('calling notifications');
  PushNotification.localNotificationSchedule({
    id: notificationInfo.notificationId,
    title: 'Order Delivery Reminder',
    message:
      orderType !== 'amazon'
        ? `Your Item ${productName} Order #${orderNumber} is estimated to arrive by ${ETA}`
        : `Your Order #${orderNumber} is estimated to arrive by ${ETA}`,
    date: new Date(ETA),
    allowWhileIdle: true,
    priority: 'max',

    /* Android Only Properties */
    repeatTime: 1,
    channelId: 'reminder_channel',
    bigPictureUrl: productImageUrl,
    // smallIcon: 'ic_launcher',
    // bigLargeIcon: 'ic_launcher',
    // largeIcon: 'ic_launcher',
  });
  await saveNotificationIdLocally(notificationInfo);
};

export const initiateAllReminders = async () => {
  try {
    if (store.orders.length > 0 || store.amazonOrders.length > 0) {
      console.log('notifications...');
      store.orders.map((order, i) => {
        order.orderItems.map((item, i) => {
          // callReminder(
          //   item.productImage,
          //   item.orderId,
          //   item.orderNumber,
          //   item.ETA,
          //   item.from,
          //   item.productName,
          // );
        });
      });
      store.amazonOrders.map((order, i) => {
        order.orderItems.map((item, i) => {
          // callReminder('', item.orderId, item.orderNumber, item.ETA, 'amazon');
        });
      });
    } else {
      console.log('No orders');
    }
  } catch (err) {
    console.error(err);
  }
};

export const initiateSelectedReminders = async () => {
  try {
    console.log(store.orders.length, store.amazonOrders.length);
    if (store.orders.length > 0 || store.amazonOrders.length > 0) {
      console.log('notifications...');
      store.orders.map((order, i) => {
        order.orderItems
          .filter(({callReminder}) => callReminder)
          .map((item) => {
            // callReminder(
            //   item.productImage,
            //   item.orderId,
            //   item.orderNumber,
            //   item.ETA,
            //   item.from,
            //   item.productName,
            // );
          });
      });
      store.amazonOrders.map((order, i) => {
        order.orderItems
          .filter(({callReminder}) => callReminder)
          .map((item) => {
            // callReminder(
            //   '',
            //   item.orderId,
            //   item.orderNumber,
            //   item.ETA,
            //   'amazon',
            // );
          });
      });
    } else {
      console.log('No orders');
    }
  } catch (err) {
    console.error(err);
  }
};
