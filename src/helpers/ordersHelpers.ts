import {sensitiveData} from '../../constants/sen_data';
import {
  AmazonOrder,
  AmazonOrderList,
  Credentials,
  Order,
  OrderList,
} from '../../constants/Types/OrderTypes';
import store from '../store/store';

import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAmazonOrders = async (auth: Credentials) => {
  const AZResponse = await fetch(
    `${sensitiveData.baseUrl}/getAmazonOrderDetails?tokens=${JSON.stringify(
      auth,
    )}&newer_than=${store.settings.orders_newer_than}`,
  );
  const AmazonOrders = await AZResponse.json();
  return AmazonOrders.amazonOrders;
};

const getFlipkartOrders = async (auth: Credentials) => {
  const FKResponse = await fetch(
    `${sensitiveData.baseUrl}/getFlipkartOrderDetails?tokens=${JSON.stringify(
      auth,
    )}&newer_than=${store.settings.orders_newer_than}`,
  );
  const FlipkartOrders = await FKResponse.json();
  return FlipkartOrders.flipkartOrders;
};
const getMyntraOrders = async (auth: Credentials) => {
  const MResponse = await fetch(
    `${sensitiveData.baseUrl}/getMyntraOrderDetails?tokens=${JSON.stringify(
      auth,
    )}&newer_than=${store.settings.orders_newer_than}`,
  );
  const MyntraOrders = await MResponse.json();
  return MyntraOrders.myntraOrders;
};

const getAjioOrders = async (auth: Credentials) => {
  const AResponse = await fetch(
    `${sensitiveData.baseUrl}/getAjioOrderDetails?tokens=${JSON.stringify(
      auth,
    )}&newer_than=${store.settings.orders_newer_than}`,
  );
  const AjioOrders = await AResponse.json();
  return AjioOrders.ajioOrders;
};

const fetchManualOrders = async (): Promise<Order[] | unknown[]> => {
  let emptyOrders: Order[] = [];
  return await database()
    .ref(`/users/${store.loginCredentials.uid}/orders`)
    .once('value')
    .then((snapshot) => {
      const orders = snapshot.val();
      // console.log(orders)
      if (orders === null) {
        return emptyOrders;
      }
      const newOrders = Object.entries(orders).map(([_, value]) => value);
      return newOrders;
    });
};

export const getOrders = async () => {
  try {
    const flipkartOrders = await getFlipkartOrders(store.googleCredentials);
    const myntraOrders = await getMyntraOrders(store.googleCredentials);
    const ajioOrders = await getAjioOrders(store.googleCredentials);
    const amazonOrders = await getAmazonOrders(store.googleCredentials);

    const manualOrders = await fetchManualOrders();

    const groupedOrders = await groupOrders(
      flipkartOrders,
      myntraOrders,
      ajioOrders,
      manualOrders as Order[],
    );
    const sortedOrders = sortOrders(groupedOrders!);

    const groupedAmazonOrders = await groupAmazonOrders(amazonOrders);
    const sortedAmazonOrders = sortAmazonOrders(groupedAmazonOrders);

    await store.saveOrders(sortedOrders);
    await store.saveOrdersLocally(sortedOrders);
    await store.saveAmazonOrders(sortedAmazonOrders);
    await store.saveAmazonOrdersLocally(sortedAmazonOrders);
  } catch (err) {
    console.error(err);
  }
};

const sortOrders = (groupedOrders: OrderList[]) => {
  groupedOrders.sort((a: OrderList, b: OrderList) => {
    return (
      parseInt(a.EstimatedDeliveryTime) - parseInt(b.EstimatedDeliveryTime)
    );
  });
  return groupedOrders;
};

const groupOrders = async (
  flipkartOrders: Order[],
  myntraOrders: Order[],
  ajioOrders: Order[],
  manualOrders: Order[],
) => {
  try {
    let superArray: Order[] = [];
    superArray = [
      ...flipkartOrders,
      ...myntraOrders,
      ...ajioOrders,
      ...manualOrders,
    ];

    let orders = await AsyncStorage.getItem('orders');
    if (orders) {
      const parsedOrders = JSON.parse(orders);
      const newOrders: Order[] = parsedOrders.reduce(
        (orderList: Order[], items: OrderList) => [
          ...orderList,
          ...items.orderItems,
        ],
        [],
      );

      newOrders.forEach((localItem) => {
        superArray.forEach((item) => {
          // console.log(item.orderId, localItem)
          if (item.orderId === localItem.orderId) {
            // console.log("matched")
            item.callReminder = localItem.callReminder;
          }
        });
      });
    }

    const groups = superArray.reduce((acc: any, order: Order) => {
      acc[Date.parse(order.ETA)] = acc[Date.parse(order.ETA)]
        ? acc[Date.parse(order.ETA)].concat(order)
        : [order];
      return acc;
    }, {});

    const newOrderList: OrderList[] = Object.entries(groups).map(([k, v]) => ({
      EstimatedDeliveryTime: k,
      orderItems: v as Order[],
    }));
    return newOrderList;
  } catch (err) {
    console.error(err);
  }
};

const groupAmazonOrders = async (amazonOrders: AmazonOrder[]) => {
  let orders = await AsyncStorage.getItem('amazonOrders');
  if (orders) {
    const parsedOrders = JSON.parse(orders);
    const newOrders: Order[] = parsedOrders.reduce(
      (orderList: AmazonOrder[], items: AmazonOrderList) => [
        ...orderList,
        ...items.orderItems,
      ],
      [],
    );

    newOrders.forEach((localItem) => {
      amazonOrders.forEach((item) => {
        if (item.orderId === localItem.orderId) {
          item.callReminder = localItem.callReminder;
        }
      });
    });
  }

  const groups = amazonOrders.reduce((acc: any, order: AmazonOrder) => {
    acc[Date.parse(order.ETA)] = acc[Date.parse(order.ETA)]
      ? acc[Date.parse(order.ETA)].concat(order)
      : [order];
    return acc;
  }, {});

  const newOrderList: AmazonOrderList[] = Object.entries(groups).map(
    ([k, v]) => ({
      EstimatedDeliveryTime: k,
      orderItems: v as AmazonOrder[],
    }),
  );
  return newOrderList;
};

const sortAmazonOrders = (groupedOrders: AmazonOrderList[]) => {
  groupedOrders.sort((a: AmazonOrderList, b: AmazonOrderList) => {
    return (
      parseInt(a.EstimatedDeliveryTime) - parseInt(b.EstimatedDeliveryTime)
    );
  });
  return groupedOrders;
};
