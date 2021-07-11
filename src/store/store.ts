import AsyncStorage from '@react-native-async-storage/async-storage';
import {applySnapshot, flow, onSnapshot, types} from 'mobx-state-tree';
import {sensitiveData} from '../../constants/sen_data';
import {OrderList, AmazonOrderList} from '../../constants/Types/OrderTypes';

export type Credentials = {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
};

export type loginCredentialsType = {
  email: string;
  uid: string;
  token: string;
};

export type userInfoType = {
  name: string;
  profilePicture: string;
};

export type settingsType = {
  orders_newer_than: string;
  show_delivered_items: boolean;
  allow_fetching_new_orders: boolean;
  dark_mode: boolean;
  show_archived_items: boolean;
};

const settings = types.model('settings', {
  orders_newer_than: types.optional(types.string, '7'),
  show_delivered_items: types.optional(types.boolean, false),
  allow_fetching_new_orders: types.optional(types.boolean, false),
  dark_mode: types.optional(types.boolean, true),
  show_archived_items: types.optional(types.boolean, false),
});

// TODO: Add firebase to store refresh_token for future logins (if uninstalled)
const googleCredentials = types.model('googleCredentials', {
  access_token: types.optional(types.string, ''),
  refresh_token: types.optional(types.string, ''),
  scope: types.optional(types.string, ''),
  token_type: types.optional(types.string, ''),
  expiry_date: types.optional(types.number, 0),
});

const loginCredentials = types.model('loginCredentials', {
  email: types.optional(types.string, ''),
  uid: types.optional(types.string, ''),
  token: types.optional(types.string, ''),
});

const userInfo = types.model('userInfo', {
  name: types.optional(types.string, ''),
  profilePicture: types.optional(types.string, ''),
});

const order = types.model('Order', {
  orderId: types.optional(types.string, ''),
  orderNumber: types.optional(types.string, ''),
  productName: types.optional(types.string, ''),
  productImage: types.optional(types.string, ''),
  sellerName: types.optional(types.string, ''),
  deliveryCharges: types.optional(types.string, ''),
  ETA: types.optional(types.string, ''),
  quantity: types.optional(types.string, ''),
  deliveryDiscount: types.optional(types.string, ''),
  productPrice: types.optional(types.string, ''),
  productLink: types.optional(types.string, ''),
  totalPrice: types.optional(types.string, ''),
  from: types.optional(types.string, ''),
  callReminder: types.optional(types.boolean, false),
});

const amazonOrder = types.model('AmazonOrder', {
  orderId: types.optional(types.string, ''),
  totalPrice: types.optional(types.string, ''),
  orderNumber: types.optional(types.string, ''),
  ETA: types.optional(types.string, ''),
  delivery_address: types.optional(types.string, ''),
  invoiceLink: types.optional(types.string, ''),
  orderPreviewLink: types.optional(types.string, ''),
  callReminder: types.optional(types.boolean, false),
});

const orderList = types.model('OrderList', {
  EstimatedDeliveryTime: types.optional(types.string, ''),
  orderItems: types.optional(types.array(order), []),
});
const amazonOrderList = types.model('AmazonOrderList', {
  EstimatedDeliveryTime: types.optional(types.string, ''),
  orderItems: types.optional(types.array(amazonOrder), []),
});

const getUserInfo = async (auth: Credentials): Promise<userInfoType> => {
  const UIResponse = await fetch(
    `${sensitiveData.baseUrl}/getUserInfo?tokens=${JSON.stringify(auth)}`,
  );
  const userInfo = await UIResponse.json();

  return userInfo;
  // console.log("user info: ", userInfo)
};

// central Store
const store = types
  .model('store', {
    userInfo: types.optional(userInfo, {}),
    settings: types.optional(settings, {}),
    orders: types.optional(types.array(orderList), []),
    amazonOrders: types.optional(types.array(amazonOrderList), []),
    googleCredentials: types.optional(googleCredentials, {}),
    loginCredentials: types.optional(loginCredentials, {}),
    didTryAutoLogin: types.optional(types.boolean, false),
    newItemAdded: types.optional(types.boolean, false),
    manualOrders: types.optional(types.array(types.string), []),
  })
  .actions((self) => ({
    updateManualOrders() {
      self.manualOrders.push('new_item');
    },
    updateNewItemAdded(status: boolean) {
      self.newItemAdded = status;
    },
    fetchUserInfo: flow(function* fetchUserInfo() {
      try {
        const userInfo: userInfoType = yield getUserInfo(
          self.googleCredentials,
        );
        console.log('userInfo: ', userInfo);
        self.userInfo = userInfo;
        return userInfo;
      } catch (error) {
        console.error('Failed to fetch projects', error);
      }
    }),
    removeUserInfo() {
      applySnapshot(self.userInfo, {});
    },
    updateSettings: flow(function* updateSettings(values: settingsType) {
      try {
        self.settings = values;
        yield AsyncStorage.setItem('settings', JSON.stringify(values));
      } catch (error) {
        console.error(error);
      }
    }),
    saveOrders: flow(function* saveOrders(orderList: OrderList[]) {
      try {
        (self as any).orders = orderList;
      } catch (error) {
        console.error(error);
      }
    }),
    saveAmazonOrders: flow(function* saveAmazonOrders(
      orderList: AmazonOrderList[],
    ) {
      try {
        (self as any).amazonOrders = orderList;
      } catch (error) {
        console.error(error);
      }
    }),
    saveOrdersLocally: flow(function* saveOrdersLocally(
      orderList: OrderList[],
    ) {
      try {
        yield AsyncStorage.setItem('orders', JSON.stringify(orderList));
        console.log('orders written to local storage!');
      } catch (error) {
        console.error(error);
      }
    }),
    saveAmazonOrdersLocally: flow(function* saveAmazonOrdersLocally(
      orderList: AmazonOrderList[],
    ) {
      try {
        yield AsyncStorage.setItem('amazonOrders', JSON.stringify(orderList));
        console.log('amazon orders written to local storage!');
      } catch (error) {
        console.error(error);
      }
    }),
    removeOrders() {
      applySnapshot(self.orders, []);
    },
    setLoginCredentials(credentials: loginCredentialsType) {
      self.loginCredentials = credentials;
    },
    resetLoginCredentials() {
      applySnapshot(self.loginCredentials, {});
      console.log(self.loginCredentials);
    },
    setCredentials(credentials: Credentials) {
      self.googleCredentials = credentials;
    },
    resetCredentials() {
      applySnapshot(self.googleCredentials, {});
      console.log(self.googleCredentials);
    },
    setTryAutoLogin() {
      self.didTryAutoLogin = true;
    },
    afterCreate() {
      onSnapshot(self.loginCredentials, () => {
        console.log('State change in Credentials!');
        if (!!self.loginCredentials) {
          console.log('auth success: ', self.loginCredentials);
        }
      });
    },
  }))
  .create({});

export default store;
