import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import store from '../store/store';

export const callReminder = (
  productImageUrl: string,
  orderId: string,
  orderNumber: string,
  ETA: string,
  orderType: string,
  productName?: string,
) => {
  PushNotification.localNotificationSchedule({
    id: parseInt(orderId.replace('-', '')),
    title: 'Order Delivery Reminder',
    message:
      orderType !== 'amazon'
        ? `Your Item ${productName} Order #${orderNumber} is estimated to arrive by ${ETA}`
        : `Your Order #${orderNumber} is estimated to arrive by ${ETA}`,
    date: new Date(ETA),
    allowWhileIdle: false,
    priority: 'max',

    /* Android Only Properties */
    // repeatTime: 1,
    channelId: 'reminder_channel',
    smallIcon: productImageUrl,
    largeIconUrl: productImageUrl,
    bigLargeIconUrl: productImageUrl,
    bigPictureUrl: productImageUrl,
  });
};

export const initiateAllReminders = async () => {
  try {
    if (store.orders.length > 0 || store.amazonOrders.length > 0) {
      console.log('notifications...');
      store.orders.map((order, i) => {
        order.orderItems.map((item, i) => {
          callReminder(
            item.productImage,
            item.orderId,
            item.orderNumber,
            item.ETA,
            item.from,
            item.productName,
          );
        });
      });
      store.amazonOrders.map((order, i) => {
        order.orderItems.map((item, i) => {
          callReminder('', item.orderId, item.orderNumber, item.ETA, 'amazon');
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
    if (store.orders.length > 0 || store.amazonOrders.length > 0) {
      console.log('notifications...');
      store.orders.map((order, i) => {
        order.orderItems
          .filter(({callReminder}) => callReminder)
          .map((item) => {
            callReminder(
              item.productImage,
              item.orderId,
              item.orderNumber,
              item.ETA,
              item.from,
              item.productName,
            );
          });
      });
      store.amazonOrders.map((order, i) => {
        order.orderItems
          .filter(({callReminder}) => callReminder)
          .map((item) => {
            callReminder(
              '',
              item.orderId,
              item.orderNumber,
              item.ETA,
              'amazon',
            );
          });
      });
    } else {
      console.log('No orders');
    }
  } catch (err) {
    console.error(err);
  }
};
